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
