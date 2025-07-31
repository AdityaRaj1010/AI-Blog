#!/bin/bash

# Build Docker image
docker build -t ai-blog-platform .

# Push to Docker Hub (optional)
# docker tag ai-blog-platform yourusername/ai-blog-platform
# docker push yourusername/ai-blog-platform

# Deploy to Vercel
vercel --prod