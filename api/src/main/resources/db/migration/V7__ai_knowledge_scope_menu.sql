-- =====================================================================
-- Migration V7: Acotar la base de conocimiento al alcance real de la web.
--
-- Esto es una LANDING comercial: muestra la carta y deriva el pedido a
-- WhatsApp. La logística de delivery (tiempos, zonas, costos) y los
-- servicios del local se gestionan por otro canal, así que el asistente
-- no debe opinar sobre ellos: deriva a WhatsApp y ya.
--
-- Se eliminan los registros semilla de V6 que quedaban fuera de alcance
-- (y que además eran ejemplos inventados, no datos reales del negocio).
-- =====================================================================

DELETE FROM ai_knowledge
WHERE topic IN (
    'Tiempo de delivery',
    'Zona de cobertura del delivery',
    'Costo del delivery',
    'Wifi y estacionamiento',
    'Reservas'
);

-- Datos sobre la carta verificados contra `menu_item`: los 17 productos
-- activos llevan carne de res o pollo, y todos van en pan brioche.
UPDATE ai_knowledge
SET answer = 'Todas las hamburguesas de la carta llevan carne de res o pollo. '
             || 'No tenemos opción vegetariana. Si buscas algo sin carne, puedes pedir '
             || 'adicionales como papas, aros de cebolla o nachos.',
    order_index = 1
WHERE topic = 'Opciones vegetarianas';

INSERT INTO ai_knowledge (topic, answer, order_index, active)
SELECT * FROM (VALUES
    ('Gluten y pan',
     'Todas nuestras hamburguesas van en pan brioche, que contiene gluten. '
     || 'No manejamos opción sin gluten en la carta.',
     2, TRUE),
    ('Papas incluidas',
     'Las hamburguesas de la carta clásica salen con papas incluidas.',
     3, TRUE),
    ('Cómo se hace un pedido',
     'Los pedidos se coordinan por WhatsApp. Elige tu hamburguesa y tus adicionales en la web, '
     || 'pulsa el botón de pedir y te atendemos por ahí.',
     4, TRUE)
) AS seed(topic, answer, order_index, active)
WHERE NOT EXISTS (
    SELECT 1 FROM ai_knowledge k WHERE k.topic = seed.topic
);
