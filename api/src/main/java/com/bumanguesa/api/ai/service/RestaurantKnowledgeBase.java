package com.bumanguesa.api.ai.service;

import com.bumanguesa.api.ai.domain.AiKnowledge;
import com.bumanguesa.api.ai.repository.AiKnowledgeRepository;
import com.bumanguesa.api.location.domain.Location;
import com.bumanguesa.api.location.repository.LocationRepository;
import com.bumanguesa.api.menu.domain.MenuItem;
import com.bumanguesa.api.menu.repository.MenuItemRepository;
import com.bumanguesa.api.settings.domain.SiteSetting;
import com.bumanguesa.api.settings.repository.SiteSettingRepository;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Arma el "expediente" del restaurante que se le entrega al modelo como
 * contexto. Todo sale de la base de datos, así que cuando el admin cambia la
 * carta, los horarios o las sedes, la IA responde con los datos nuevos sin
 * tocar código ni reiniciar nada.
 */
@Service
@Transactional(readOnly = true)
public class RestaurantKnowledgeBase {

    private final MenuItemRepository menuItemRepository;
    private final LocationRepository locationRepository;
    private final SiteSettingRepository siteSettingRepository;
    private final AiKnowledgeRepository knowledgeRepository;

    public RestaurantKnowledgeBase(MenuItemRepository menuItemRepository,
                                   LocationRepository locationRepository,
                                   SiteSettingRepository siteSettingRepository,
                                   AiKnowledgeRepository knowledgeRepository) {
        this.menuItemRepository = menuItemRepository;
        this.locationRepository = locationRepository;
        this.siteSettingRepository = siteSettingRepository;
        this.knowledgeRepository = knowledgeRepository;
    }

    /** Productos activos, en el orden en que se muestran en la web. */
    public List<MenuItem> activeMenu() {
        return menuItemRepository.findByActiveTrueOrderByOrderIndexAsc();
    }

    /**
     * Catálogo numerado para el recomendador.
     *
     * @param promptText lista lista para el prompt, numerada 1..N
     * @param byIndex    traducción de ese número al producto real
     */
    public record Catalog(String promptText, Map<Integer, MenuItem> byIndex) {
    }

    /**
     * Construye el catálogo con <b>índices efímeros</b> (1..N válidos solo dentro
     * de esta petición) en lugar de las claves primarias de la base de datos.
     *
     * <p>Es la mitigación de raíz de la fuga de identificadores: aunque un
     * atacante consiga que el modelo vuelque el prompt entero, obtiene números de
     * posición sin valor fuera de la llamada, no las PK reales de {@code menu_item}.
     */
    public Catalog buildCatalog() {
        List<MenuItem> menu = activeMenu();
        Map<Integer, MenuItem> byIndex = new LinkedHashMap<>();
        StringBuilder sb = new StringBuilder(1024);

        int index = 1;
        for (MenuItem item : menu) {
            byIndex.put(index, item);
            sb.append(index).append(". ").append(item.getTitle())
                    .append(" | precio ").append(item.getBadge())
                    .append(" | ").append(item.getDescription())
                    .append('\n');
            index++;
        }
        return new Catalog(sb.toString(), byIndex);
    }

    /** Contexto en texto plano listo para inyectar en el system prompt. */
    public String buildContext() {
        StringBuilder sb = new StringBuilder(2048);

        siteSettingRepository.findAll(Sort.by("id")).stream().findFirst().ifPresent(cfg -> {
            sb.append("== NEGOCIO ==\n");
            sb.append("Nombre: ").append(cfg.getBrand()).append('\n');
            sb.append("Ciudad: ").append(cfg.getCity()).append(", ").append(cfg.getCountry()).append('\n');
            sb.append("WhatsApp de pedidos: ").append(cfg.getWhatsappDisplay()).append('\n');
            sb.append("Horario lunes a jueves: ").append(cfg.getHoursWeekdays()).append('\n');
            sb.append("Horario viernes a domingo: ").append(cfg.getHoursWeekend()).append('\n');
            appendPayment(sb, cfg);
            sb.append('\n');
        });

        List<MenuItem> menu = activeMenu();
        if (!menu.isEmpty()) {
            // Ordenada de mayor a menor precio: los modelos pequeños fallan al
            // comparar cifras dispersas en una lista, pero leen bien un orden ya dado.
            List<MenuItem> byPrice = menu.stream()
                    .sorted(Comparator.comparingDouble(RestaurantKnowledgeBase::priceOf).reversed())
                    .toList();

            sb.append("== CARTA (ordenada del MÁS CARO al MÁS BARATO) ==\n");
            for (MenuItem item : byPrice) {
                // Sin identificadores internos: si el modelo llegara a volcar este
                // bloque, solo revelaría lo que ya está publicado en la web.
                sb.append("- ").append(item.getTitle())
                        .append(" | precio: ").append(item.getBadge())
                        .append(" | ").append(item.getDescription())
                        .append('\n');
            }
            sb.append("El primero de esa lista es el más caro y el último el más barato. ")
                    .append("Varios productos pueden compartir el mismo precio.\n\n");
        }

        // Lo que el negocio le ha enseñado desde el panel. Va antes de las sedes
        // para que quede cerca del inicio del contexto, donde el modelo lo pondera más.
        List<AiKnowledge> facts = knowledgeRepository.findByActiveTrueOrderByOrderIndexAsc();
        if (!facts.isEmpty()) {
            sb.append("== INFORMACIÓN ADICIONAL DEL NEGOCIO ==\n");
            for (AiKnowledge fact : facts) {
                sb.append("- ").append(fact.getTopic())
                        .append(": ").append(fact.getAnswer())
                        .append('\n');
            }
            sb.append('\n');
        }

        List<Location> locations = locationRepository.findByActiveTrueOrderByOrderIndexAsc();
        if (!locations.isEmpty()) {
            sb.append("== SEDES ==\n");
            for (Location location : locations) {
                sb.append("- ").append(location.getName())
                        .append(": ").append(location.getAddress())
                        .append('\n');
            }
            sb.append('\n');
        }

        return sb.toString();
    }

    /** Extrae el número de un badge tipo {@code "S/ 32.00"}; 0 si no se puede leer. */
    private static double priceOf(MenuItem item) {
        String digits = item.getBadge() == null ? "" : item.getBadge().replaceAll("[^0-9.]", "");
        try {
            return digits.isBlank() ? 0d : Double.parseDouble(digits);
        } catch (NumberFormatException ex) {
            return 0d;
        }
    }

    private static void appendPayment(StringBuilder sb, SiteSetting cfg) {
        if (cfg.getYapeNumber() != null && !cfg.getYapeNumber().isBlank()) {
            sb.append("Pago por Yape/Plin al ").append(cfg.getYapeNumber());
            if (cfg.getYapeHolder() != null && !cfg.getYapeHolder().isBlank()) {
                sb.append(" (titular: ").append(cfg.getYapeHolder()).append(')');
            }
            sb.append(". También se acepta efectivo o tarjeta contra entrega.\n");
        }
    }
}
