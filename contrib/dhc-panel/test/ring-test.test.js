// The ring test on the edge's page: rings like the door station, without it.
import { describe, it, expect } from "vitest";
import engineLib from "../lib/engine.js";

function fakeEngine(codes, online) {
    const sent = [], watched = [], emitted = [];
    const self = {
        registry: { codes },
        online: new Map(online.map((id) => [id, true])),
        event: (id, body) => sent.push({ id, ...body }),
        watch: (id, ringId, ms) => watched.push({ id, ms }),
        setOffBell: () => 2,
        emit: (kind, body) => emitted.push({ kind, ...body }),
    };
    return { self, sent, watched, emitted };
}

describe("the ring test", () => {
    const codes = [
        { id: "pkitchen", name: "Kitchen", bell: "listen" },
        { id: "pbed", name: "Bedroom", bell: "listen" },
        { id: "ptiles", name: "Lights", bell: "none" },
        { id: "pdoor", name: "Porte", kind: "door", bell: "ring" },
    ];
    it("rings every listening phone, sets off the bell, and asks the door camera", () => {
        const f = fakeEngine(codes, ["pkitchen", "pdoor"]);
        const r = engineLib.Engine.prototype.testRing.call(f.self, "Test");
        expect(r).toEqual({ listeners: 1, targets: 2, camera: true });
        expect(f.sent.filter((e) => e.t === "ring").map((e) => e.id)).toEqual(["pkitchen", "pbed"]);
        expect(f.sent.find((e) => e.t === "ring").from).toBe("Porte");
        expect(f.sent.some((e) => e.id === "ptiles")).toBe(false);
        expect(f.sent.find((e) => e.id === "pdoor")).toMatchObject({ t: "rung", listeners: 1 });
        expect(f.watched).toEqual([{ id: "pdoor", ms: expect.any(Number) }]);
        expect(f.self.lastRing.from).toBe("pdoor");            // an answer goes to the door station
        expect(f.emitted[0]).toMatchObject({ kind: "ring", test: true });
    });
    it("rings without a door station when none is online", () => {
        const f = fakeEngine(codes, []);
        const r = engineLib.Engine.prototype.testRing.call(f.self, "Test");
        expect(r).toEqual({ listeners: 0, targets: 2, camera: false });
        expect(f.watched).toEqual([]);
        expect(f.sent.find((e) => e.t === "ring").from).toBe("Test");
    });
});
