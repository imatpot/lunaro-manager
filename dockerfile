FROM denoland/deno:1.21.2

WORKDIR /mnt/app
USER deno

COPY . .

RUN deno cache deps.ts
RUN deno cache main.ts

CMD [ "run", "--allow-net", "main.ts" ]
