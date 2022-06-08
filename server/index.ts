import onPing from "./handlers/ping";
import onRequestId from "./handlers/requestId";
import wrapper from "./networking";

wrapper.on("ping", onPing);
wrapper.on("requestId", onRequestId);