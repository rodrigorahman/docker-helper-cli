# Configuracoes adicionais

Para facilitar sua vida você pode utilizar algumas configurações extras para seu projeto, para isso basta criar o arquivo dhc-config.json

Para dizer qual é a aplicação default para configurações como hotdeploy (hd) ou mesmo start com logs (s -l)

```json
{
  "defaultWebProjectName" : "flightgroup-api",
}
```

## Para adicionar a lista de escolhas no rebuild de um projeto

Para isso basta adicionar as apps dentro do atributo appsEnabled

```json
{
  "defaultWebProjectName" : "flightgroup-api",
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
  "defaultWebProjectName" : "flightgroup-api",
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