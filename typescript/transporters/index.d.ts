import BaseTransporter = require("./base");
import FakeTransporter = require("./fake");
import NatsTransporter = require("./nats");
import MqttTransporter = require("./mqtt");
import RedisTransporter = require("./redis");
import AmqpTransporter = require("./amqp");
import Amqp10Transporter = require("./amqp10");
import KafkaTransporter = require("./kafka");
import TcpTransporter = require("./tcp");

export {
	BaseTransporter as Base,
	FakeTransporter as Fake,
	NatsTransporter as NATS,
	MqttTransporter as MQTT,
	RedisTransporter as Redis,
	AmqpTransporter as AMQP,
	Amqp10Transporter as AMQP10,
	KafkaTransporter as Kafka,
	TcpTransporter as TCP
};

export declare function resolve(opt: Record<string, any> | string): BaseTransporter;
export declare function register(name: string, value: BaseTransporter): void;
