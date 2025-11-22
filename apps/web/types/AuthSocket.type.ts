import { Socket as SocketIO, DefaultEventsMap } from "socket.io";
import { Session } from "next-auth";
export interface AuthSocket
  extends SocketIO<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any> {
  user: Session["user"];
}
