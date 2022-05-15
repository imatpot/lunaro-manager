FROM denoland/deno:1.21.2

WORKDIR /mnt/app
USER deno

COPY . .

RUN deno task cache

CMD [ "task", "start" ]
