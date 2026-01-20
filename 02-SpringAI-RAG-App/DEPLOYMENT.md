# Deploying to Render

This guide shows you how to deploy your **Spring AI RAG App** to Render.
Because the app includes a static HTML frontend (`src/main/resources/static`), we only need to deploy the Java Backend.

## Prerequisites

1.  **Render Account**: [Sign up here](https://render.com).
2.  **GitHub Repository**: Push your code to a GitHub repository.

## Step 1: Deploy to Render

1.  Log in to the [Render Dashboard](https://dashboard.render.com).
2.  Click **New +** and select **Web Service**.
3.  Connect your GitHub repository.
4.  Configure the service:
    - **Name**: `spring-ai-rag` (or any name you like)
    - **Runtime**: **Docker** (Render will automatically detect the `Dockerfile` I added).
    - **Region**: Select a region close to you (e.g., Singapore, Frankfurt).
    - **Instance Type**: **Free**.

## Step 2: Configure Environment Variables

Scroll down to the **Environment Variables** section and add the following keys. These are required for the app to function.

| Key | Value |
| :--- | :--- |
| `OPENAI_API_KEY` | `sk-...` (Your OpenAI API Key) |
| `PINECONE_API_KEY` | `pcsk_...` (Your Pinecone API Key) |

## Step 3: Finish Deployment

1.  Click **Create Web Service**.
2.  Render will start building your Docker image. This may take a few minutes (downloading Maven dependencies, compiling Java).
3.  Once deployment is successful, you will see a URL like `https://spring-ai-rag.onrender.com`.

## Step 4: Access the App

Open the URL provided by Render. You should see your **Spring AI RAG Chat** interface.
- **Frontend**: Served automatically at the root URL.
- **Backend**: Handles API requests internally.
