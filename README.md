# Agave Intel
A mobile remote sensing platform for monitoring the health and vigor of Blue Weber Agave fields in Jalisco, Mexico.

Developed for the NASA Space Apps Challenge, Agave Intel is a tool designed to provide actionable intelligence to stakeholders in the tequila industry. It leverages satellite data to deliver near real-time insights into crop conditions, enabling data-driven decisions for resource management and field scouting.

## How It Works
The system is built on a client-server architecture:

Python Backend (Server): A Flask-based API that uses the Google Earth Engine to process NASA (Landsat 8) and ESA (Sentinel-2) imagery. It applies a land-use map to isolate agricultural areas and calculates two key vegetation indices:

NDVI (Normalized Difference Vegetation Index): To assess plant vigor and biomass.

NDRE (Normalized Difference Red Edge Index): To detect potential plant health issues and stress.
The backend serves this analysis as dynamic map tile URLs.

React Native (Client): A cross-platform mobile application that provides the user interface. The app features an interactive map where a user can select a specific year and month. It calls the backend API to fetch the corresponding NDVI and NDRE map layers and displays them, allowing users to switch between a "Vigor" and "Health" view.

## Key Features
Vigor & Health Monitoring: Interactive visualization of NDVI and NDRE to assess crop status across the region.

Precision Focus: Analysis is masked to agricultural zones only, filtering out noise from cities, forests, and other land cover types for higher accuracy.

Time-Series Analysis: A date selector allows users to compare current conditions with historical data to identify trends and anomalies.

## Technology Stack
Backend: Python, Flask, Google Earth Engine API, Pandas

Frontend: React Native, Expo

Data Sources: NASA Landsat 8, ESA Sentinel-2, INEGI Land Use/Vegetation Vector Map

Collaboration: Git, GitHub
