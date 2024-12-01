import { assertEquals } from "jsr:@std/assert/equals";
import { getDockerComposeConfig } from "../src/commands/get_dc_config.ts";
import { Container } from "../src/container.ts";
import { ContainerMovement } from "../src/container_movement.ts";
import { toNewKeyValues } from "../src/utils/misc.ts";

Container.ENV_FILE_NAME = ".envtest";

const config = getDockerComposeConfig(
  `./tests/mocks/project1/docker-compose.yml`,
);
const services = config.getContainers();
const movement = new ContainerMovement();

Deno.test("service1 moved out", () => {
  const service1 = services.find((s) => s.name === "service1");
  const restServices = services.filter((s) => s.name !== "service1");

  if (!service1) {
    throw new Error("service1 not found");
  }

  const diff = movement.getDiffsWhenMovedOut(service1, restServices);

  const expectedService1Env = {
    SERVICE2_URL: "http://localhost:5000/api",
    SERVICE3_URL: "postgresql://dbuser:dbpass@localhost:6000/mydb",
  };
  const expectedService2Env = {
    SERVICE1_URL: "http://localhost:4000/",
  };

  assertEquals(expectedService1Env, toNewKeyValues(diff.service1));
  assertEquals(expectedService2Env, toNewKeyValues(diff.service2));
  assertEquals({}, toNewKeyValues(diff.service3));
});
