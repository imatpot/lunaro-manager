FROM denoland/deno:1.21.2

WORKDIR /mnt/app

COPY src src
COPY deno.json paths.json .env ./

CMD [ "task", "start" ]
