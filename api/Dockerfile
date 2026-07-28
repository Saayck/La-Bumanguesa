# =====================================================================
# La Bumanguesa API — multi-stage build
# =====================================================================

# ---- Etapa 1: build con Maven + JDK 21 ----
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app

# Cachear dependencias: solo se re-descargan si cambia el pom.xml
COPY pom.xml .
RUN mvn -q -ntp dependency:go-offline

COPY src ./src
RUN mvn -q -ntp package -DskipTests

# ---- Etapa 2: runtime liviano con JRE 21 ----
FROM eclipse-temurin:21-jre
WORKDIR /app

RUN adduser --system --group appuser && \
    chown -R appuser:appuser /app

COPY --from=build --chown=appuser:appuser /app/target/*.jar app.jar

USER appuser

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
