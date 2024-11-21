# SBuilder - Proof of Concept (POC) Project

## Please Read This

This is Avaxia Company's Proof of Concept (PoC) Project.
Avaxia has granted approval for publishing this project with some modifications.

## Overview

SBuilder is a proof-of-concept application designed to streamline the process of creating and managing builds for the launcher app. It automates several essential tasks to ensure an efficient and consistent build pipeline.

## Features

1. Generate Version and Build Numbers

- Automatically generates a version number.
- Assigns a unique build number for each new build.

2. Clean Up Build Junk

- Removes unnecessary files and artifacts from previous builds.

3. Generate Setting File

- Creates a settings file for the launcher app with:
- A unique ID.
- A unique build number.

4. Local Git Commit

- Automatically commits changes to the project repository.

5. Build Automation

- Supports multiple builds in a single session.

6. Google Drive Integration

- Uploads build files directly to Google Drive for easy sharing and storage.

## Usage

### Prerequisites

- Ensure you have Node.js installed.
- Set up your Google Drive API credentials (if not already configured).
