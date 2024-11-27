# compose file path
COMPOSE_FILE="$HOME/Documents/infra/local-infra/docker-compose.yaml"

# modify .env file of all services
mkdir -p inspect
for service in $(docker-compose -f $COMPOSE_FILE config --services); do
    # docker inspect and extract mounts
    json=$(docker inspect $(docker-compose -f $COMPOSE_FILE ps -q $service))


    # for each mount extract Source
    json=$(docker inspect $(docker-compose -f $COMPOSE_FILE ps -q $service))
    inspectData=$(echo $json | jq '.[0]')

    # output {Mounts,HostConfig} using jq to a json file, overwrite if exists
    echo $inspectData | jq '{Mounts,HostConfig}' > inspect/$service.json
done

# echo home directory path

echo $all_mounts
