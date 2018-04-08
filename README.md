# Instalação 

Instale sempre esse pacote como global pois só assim ele poderá se executado de qualquer pasta

```
npm i docker-helper-cli --global
```

# Visualizando lista de comandos

```
docker-helper-cli --help
```

**OU**

```
dhc --help
```

# Executando um start stack (docker-compose up)

```
docker-helper-cli s
```

**OU**

```
dhc s
```

## Para ao final ele mostrar o log da aplicação default utilize: 


```
docker-helper-cli s -l
```

**OU**

```
dhc s -l
```


# Configuracoes adicionais

Para facilitar sua vida você pode utilizar algumas configurações extras para seu projeto, para isso basta criar o arquivo dhc-config.json

Para dizer qual é a aplicação default para configurações como hotdeploy (hd) ou mesmo start com logs (s -l)

```json
{
  "defaultWebProjectName" : "service-name-defined-in-docker-compose",
}
```

## Para adicionar a lista de escolhas no rebuild de um projeto

Para isso basta adicionar as apps dentro do atributo appsEnabled

```json
{
  "defaultWebProjectName" : "service-name-defined-in-docker-compose",
  "appsEnabled": [
    {"name": "redis"},
    {"name": "consul"}
  ]
}
```

## Criando seus proprios comandos 

Para criar seus comandos você deve adicionar a tag customCommandExec.


ex:
```json
{
  "defaultWebProjectName" : "service-name-defined-in-docker-compose",
  "appsEnabled": [
    {"name": "redis"},
    {"name": "consul"}
  ],
  "customCommandExec": [
    {
      "name": "docker ps",
      "description": "lista as dockers",
      "alias": "ps",
      "command":["docker ps", "docker ps -a"] 
    },
    {
      "name": "docker ps -a",
      "description": "lista as dockers",
      "alias": "psa",
      "command": ["docker ps -a"]
    }
  ]
}
```

# Para projetos não JAVA

Caso você não trabalhe com java e queira utilizar a nossa lib.

Basta adicionar o atributo "javaProject" na configuração.

ex:

```json
{
  "defaultWebProjectName" : "service-name-defined-in-docker-compose",
  "javaProject": false
}
```