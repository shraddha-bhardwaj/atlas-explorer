
FROM node:18-alpine


WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

# Set env  for build 
ENV MONGODB_URI=mongodb://mongodb:27017/country-explorer
ENV USE_API_DATA_SOURCE=false 
ENV REST_COUNTRIES_API_URL=https://restcountries.com/v3.1 
ENV ITEMS_PER_PAGE=12 
ENV NODE_ENV=production

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
