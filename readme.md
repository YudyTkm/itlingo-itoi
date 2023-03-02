<br/>
<div id="theia-logo" align="center">
    <br />
    <img src="https://raw.githubusercontent.com/eclipse-theia/theia/master/logo/theia-logo.svg?sanitize=true" alt="Theia Logo" width="300"/>
     <h3>Cloud & Desktop IDE Platform</h3>
</div>
<br>


# Itoi Theia IDE on Heroku

This repositorty includes image to run a single theia instance, and a docker-compose that couples it to a database.

## Instalation

Install docker compose

[https://www.docker.com/products/docker-desktop/](https://www.docker.com/products/docker-desktop/)

Clone this repository and inside the folder run:

```
docker build . -t itoi
docker compose up
```

This should build and run the containers, you can confirm this through the Docker interface or running:

```
docker container ls
```

You can now access Theia through:

[http://127.0.0.1:3000/](http://127.0.0.1:3000/)