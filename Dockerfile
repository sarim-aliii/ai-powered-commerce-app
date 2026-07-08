# Stage 1: Build the application
FROM maven:3.9.4-eclipse-temurin-17 AS build
WORKDIR /app

# Copy the pom.xml and source code
COPY pom.xml .
COPY src ./src

# Build the application, skipping tests to speed up deployment
RUN mvn clean package -DskipTests

# Stage 2: Create the production image
FROM eclipse-temurin:17-jre
WORKDIR /app

# Copy the built .jar file from the previous stage
COPY --from=build /app/target/*.jar app.jar

# Expose the standard Spring Boot port
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]