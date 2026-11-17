// After the phone slept, kick() drops the old socket at once and connects anew.
import { describe, it, expect, afterEach } from "vitest";
import tinymqtt from "../../../webapp/static/panel/tinymqtt.js";

const made = [];
class FakeSocket {
    constructor(url) { this.url = url; this.readyState = 0; this.closed = false; this.sent = []; made.push(this); }
    send(b) { this.sent.push(b); }
    close() { this.closed = true; this.readyState = 3; }
    // the broker accepts: CONNACK, return code 0
    accept() { this.readyState = 1; this.onopen(); this.onmessage({ data: new Uint8Array([0x20, 2, 0, 0]).buffer }); }
}
const saved = globalThis.WebSocket;
afterEach(() => { globalThis.WebSocket = saved; made.length = 0; });

describe("tinymqtt kick", () => {
    it("closes a live socket, reports the link down once, and opens a new one now", () => {
        globalThis.WebSocket = FakeSocket;
        const downs = [], ups = [];
        const link = tinymqtt({ url: "ws://edge:9001", username: "p1", password: "s", onUp: () => ups.push(1), onDown: (w) => downs.push(w), onMessage() {} });
        made[0].accept();
        expect(link.isUp()).toBe(true);
        link.kick();
        expect(made[0].closed).toBe(true);
        expect(made).toHaveLength(2);                        // no waiting for a retry timer
        expect(downs).toEqual(["lost"]);
        expect(link.isUp()).toBe(false);
        made[0].onclose && made[0].onclose();                 // the old socket's late close does nothing
        expect(made).toHaveLength(2);
        made[1].accept();
        expect(ups).toHaveLength(2);
        link.close();
    });
    it("does nothing once the link was closed for good", () => {
        globalThis.WebSocket = FakeSocket;
        const link = tinymqtt({ url: "ws://edge:9001", username: "p1", password: "s", onMessage() {} });
        link.close();
        link.kick();
        expect(made).toHaveLength(1);
    });
});
