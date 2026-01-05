<H3> Non-Root_user </H3>
<p>addgroup --system webgroup</p>

<h5>What it does:</h5>

Creates a system group named webgroup

<h5>Why --system? </h5>

<h6>System groups: </h6>

Have lower privileges

Are meant for services (like Nginx)


2️⃣ addgroup --system webgroup

What it does:

Creates a system group named webgroup

Why --system?

System groups:

Have lower privileges

Are meant for services (like Nginx)

Don’t allow login by default


----------------------------------------------------

1️⃣ Why root is still needed during Docker image build

Even when your container runs as non-root, the build process needs root.

🔹 Reason 1: Installing system packages

During build we often run:

RUN apt-get update && apt-get install -y nginx


📌 Installing packages requires:

Writing to /usr/bin

Writing to /etc

Updating system libraries

➡️ Only root can do this

🔹 Reason 2: Creating users and groups

This command:

RUN addgroup --system webgroup \
    && adduser --system webuser


Modifies:

/etc/passwd

/etc/group

/etc/shadow

➡️ These files are root-owned, so root is required.

🔹 Reason 3: Changing file ownership & permissions

Example:

RUN chown -R webuser:webgroup /usr/share/nginx/html


➡️ chown is restricted to root

🔹 Reason 4: Binding privileged ports (≤1024)

Nginx uses port 80.

Ports <1024 are privileged

Only root can bind to them initially

📌 Nginx starts as root → binds to port 80 → drops privileges internally.

🧠 Key Concept (Very Important)

Build time ≠ Run time

Phase	User
Image build	root
Container runtime	non-root
🔑 Interview Answer

“Root is required during the image build to install packages, create users, set permissions, and configure the OS. However, containers should run as a non-root user for security.”