import { useRef, useEffect, useState } from "react";

export interface LogEntry {
    id: number;
    text: string;
    type: "info" | "success" | "error" | "warn";
    timestamp: string;
}

interface TerminalLogProps {
    logs: LogEntry[];
    onClearLogs?: () => void;
}

export default function TerminalLog({ logs, onClearLogs }: TerminalLogProps) {
    const bottomRef = useRef<HTMLDivElement>(null);
    const [filter, setFilter] = useState<string>("ALL");
    const [autoScroll, setAutoScroll] = useState<boolean>(true);
    const [copied, setCopied] = useState<boolean>(false);

    useEffect(() => {
        if (autoScroll) {
            bottomRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [logs, autoScroll]);

    const filteredLogs = logs.filter((log) => {
        if (filter === "ALL") return true;
        if (filter === "ERRORS") return log.type === "error" || log.type === "warn";
        return log.text.toUpperCase().includes(`[${filter}]`);
    });

    const handleCopyLogs = async () => {
        if (logs.length === 0) return;
        const text = logs.map(l => `[${l.timestamp}] ${l.type.toUpperCase()}: ${l.text}`).join("\n");
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };


    const renderFormattedText = (text: string) => {
        const tagRegex = /^(\[(1AM|AUTH|CHAIN|CONTRACT|CRYPTO|HASH|MIDNIGHT|STEGO|ZIP|SUCCESS|VAULT|INFO|ERROR|FEEDBACK)\])(.*)$/;
        const match = text.match(tagRegex);

        if (!match) {
            return <span>{text}</span>;
        }

        const tag = match[1];
        const moduleName = match[2];
        const rest = match[3];

        let tagClass = "terminal-tag-default";
        if (moduleName === "1AM") tagClass = "terminal-tag-1am";
        else if (moduleName === "AUTH") tagClass = "terminal-tag-auth";
        else if (moduleName === "CHAIN") tagClass = "terminal-tag-chain";
        else if (moduleName === "CONTRACT") tagClass = "terminal-tag-contract";
        else if (moduleName === "CRYPTO") tagClass = "terminal-tag-crypto";
        else if (moduleName === "HASH") tagClass = "terminal-tag-crypto";
        else if (moduleName === "MIDNIGHT") tagClass = "terminal-tag-midnight";
        else if (moduleName === "STEGO") tagClass = "terminal-tag-stego";
        else if (moduleName === "ZIP") tagClass = "terminal-tag-zip";
        else if (moduleName === "SUCCESS") tagClass = "terminal-tag-success";
        else if (moduleName === "VAULT") tagClass = "terminal-tag-auth";
        else if (moduleName === "FEEDBACK") tagClass = "terminal-tag-zip";
        else if (moduleName === "ERROR") tagClass = "terminal-tag-error";
        else if (moduleName === "INFO") tagClass = "terminal-tag-default";

        return (
            <span>
                <span className={`terminal-module-tag ${tagClass}`}>{tag}</span>
                {rest}
            </span>
        );
    };

    return (
        <section className="card dk rv grid" data-g="all zk" style={{ display: "block" }}>
            <div className="ch" style={{ alignItems: "center" }}>
                <div>
                    <div className="tdots">
                        <i></i><i></i><i></i>
                    </div>
                    <div className="tl">midnight_audit_daemon.sh</div>
                    <h2 style={{ fontSize: "22px", marginTop: "10px" }}>Midnight Preprod · 1AM Wallet</h2>
                </div>
                <div className="cact">
                    <button
                        type="button"
                        className={`btn s ${autoScroll ? "p" : ""}`}
                        onClick={() => setAutoScroll(!autoScroll)}
                        title={autoScroll ? "Disable Auto-Scroll" : "Enable Auto-Scroll"}
                    >
                        {autoScroll ? "Auto: ON" : "Auto: OFF"}
                    </button>
                    <button
                        type="button"
                        className="btn s"
                        onClick={handleCopyLogs}
                        disabled={logs.length === 0}
                        title="Copy all logs to clipboard"
                    >
                        {copied ? "Copied" : "Copy"}
                    </button>
                    {onClearLogs && (
                        <button
                            type="button"
                            className="btn s"
                            onClick={onClearLogs}
                            disabled={logs.length === 0}
                            title="Clear terminal log history"
                        >
                            Clear
                        </button>
                    )}
                </div>
            </div>

            {/* Filter Bar */}
            <div className="fl" id="fl">
                <span className="t">FILTER STREAM</span>
                {(["ALL", "1AM", "STEGO", "CRYPTO", "CONTRACT", "ERRORS"] as const).map((tag) => (
                    <button
                        key={tag}
                        type="button"
                        className={`chip ${filter === tag ? "on" : ""}`}
                        onClick={() => setFilter(tag)}
                    >
                        {tag}
                    </button>
                ))}
                <em>{filteredLogs.length} {filteredLogs.length === 1 ? "event" : "events"}</em>
            </div>

            <div className="log">
                {filteredLogs.length === 0 && (
                    <div>
                        <span className="pr">$</span>{" "}
                        {logs.length === 0 ? "Awaiting 1AM Wallet connection & Midnight contract instructions…" : `No log entries matching filter [${filter}].`}
                        <span className="cur" />
                    </div>
                )}
                {filteredLogs.map((log) => (
                    <div key={log.id} style={{ marginBottom: "4px" }}>
                        <span className="pr">$</span>{" "}
                        <span style={{ color: "#77757a", marginRight: "8px", fontSize: "11px" }}>[{log.timestamp}]</span>
                        <span>{renderFormattedText(log.text)}</span>
                    </div>
                ))}
                {filteredLogs.length > 0 && <span className="cur" />}
                <div ref={bottomRef} />
            </div>
        </section>
    );
}
