#------------------------------ WITH ROOT USER ------------------------------------------
FROM node:trixie-slim

LABEL maintainer="devops"
LABEL app="backend_task_manager"

WORKDIR /app

COPY package*.json .
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]

# --------------------------------- WITH NON_ROOT_USER & GROUP ------------------------------------
# FROM node:trixie-slim

# LABEL maintainer="devops"
# LABEL app="backend_task_manager"

# RUN addgroup --system backend_task_manager_group \
#  && adduser --system --ingroup backend_task_manager_group backend_task_manager_user

# WORKDIR /app

# # Install dependencies first (better cache)
# COPY package.json package-lock.json ./
# RUN npm ci --only=production

# # Copy app source
# COPY . .

# # Change ownership AFTER copying files
# RUN chown -R backend_task_manager_user:backend_task_manager_group /app

# # Switch to non-root user
# USER backend_task_manager_user

# EXPOSE 3000

# CMD ["npm", "start"]

# ---------------------------- Multi-Stage Dockerfile ---------------------------------------------
# FROM node:trixie-slim AS build

# LABEL maintainer="devops"
# LABEL app="backend_task_manager"

# WORKDIR /app

# COPY package.json package-lock.json ./
# RUN npm ci --only=production

# COPY . .

# # ----------------------------

# FROM node:trixie-slim

# WORKDIR /app

# COPY --from=build /app ./

# EXPOSE 3000

# CMD ["npm", "start"]



