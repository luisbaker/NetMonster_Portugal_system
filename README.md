# NetMonster Portugal Core System

Development Status: Alpha

## NetMonster Portugal - Frontend System Overview

**Simple Description:**

NetMonster Portugal manages the collection and processing of location data, sending it to the national carriers' databases. This system includes:

**Features:**

1. **Regular NTM Updates:**
   - Maintains online a specific NTM file for each carrier, with regular updates.

2. **Location Data Submission:**
   - Users submit information in JSON format through the endpoint.

3. **Integration with Databases:**
   - Facilitates efficient integration by directing information to each carrier's databases.

4. **Flexible Processing:**
   - Allows for custom decisions in processing the information.

**Daily Usage Information:**

   - Provides data on daily active users.
   - Records most-used smartphone models by brand.

**Model Registration by Carriers:**

   - Captures and registers the most-used smartphone models for each carrier.
   - Includes relevant statistics for Vodafone Portugal, NOS, MEO, and Digi Portugal.

**Frontend NetMonster Portugal:**
   - Interface system displaying national statistics and specific information for Vodafone Portugal, NOS, MEO, and Digi Portugal.
   - Provides access to the databases of each national carrier.
   - Includes a map system for enhanced visualization.

# Project Setup and Start Guide

## Prerequisites

Before you begin, ensure you have met the following requirements:

- You have installed the latest LTS version of [Node.js and npm](https://nodejs.org/en/download/).
- You have a Windows/Linux/Mac machine.

## Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/NetMonster_Portugal_system.git
   ```

2. Navigate to the project directory:

   ```bash
   cd NetMonster_Portugal_system
   ```

3. Install the project dependencies:

   ```bash
   npm install
   ```

## Start

To start the project, run the following command: `npm start`


## Environment Variables

The following environment variables can be configured in the project:

- `PORT`: The port number on which the server will listen. Default is `8080`.

Make sure to set these variables according to your environment before starting the project.

## Linting and formatting

This projects uses [Biome](https://biomejs.dev/guides/getting-started/) to lint and format all JavaScript files. Make sure to install the [VSCode extension](https://biomejs.dev/guides/integrate-in-editor/#vs-code) to have support for Biome while developing.

