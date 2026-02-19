export type AlertType = "down" | "recovery" | "unknown";
export type AlertDeliveryStatus = "pending" | "processing" | "sent" | "failed";

export type AlertMonitor = {
    _id?: string;
    name?: string;
    url?: string;
};

export type RawAlert = {
    _id?: string;
    type: AlertType;
    status?: AlertDeliveryStatus | null;
    sent_via?: string | string[] | null;
    sent_at?: string | Date | null;
    monitorId?: string | AlertMonitor | null;
};

function normalizeStatus(status: AlertDeliveryStatus | null | undefined) {
    return (status ?? "").toLowerCase();
}

export function getAlertMonitor(monitorId: RawAlert["monitorId"]) {
    if (!monitorId || typeof monitorId === "string") {
        return null;
    }

    return monitorId;
}

export function formatSentVia(sentVia: RawAlert["sent_via"]) {
    if (Array.isArray(sentVia)) {
        return sentVia.join(", ");
    }

    if (typeof sentVia === "string" && sentVia.trim().length > 0) {
        return sentVia;
    }

    return "Email";
}

export function formatSentAt(
    sentAt: RawAlert["sent_at"],
    status?: AlertDeliveryStatus | null
) {
    const normalizedStatus = normalizeStatus(status);

    if (normalizedStatus === "failed") {
        return "Failed";
    }

    if (normalizedStatus === "pending") {
        return "Pending";
    }

    if (normalizedStatus === "processing") {
        return "Processing";
    }

    if (normalizedStatus === "sent" && !sentAt) {
        return "Sent";
    }

    if (!sentAt) {
        return "Not sent";
    }

    const date = new Date(sentAt);
    if (Number.isNaN(date.getTime())) {
        return "Unknown";
    }

    return date.toLocaleString();
}
