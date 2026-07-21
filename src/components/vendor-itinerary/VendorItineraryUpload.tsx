"use client";

import { useEffect, useRef, useState } from "react";
import { FileText, RefreshCw, UploadCloud } from "lucide-react";
import { extractError, unwrap } from "@/components/shared/form-utils";
import VendorItineraryReview from "./VendorItineraryReview";
import {
  ACCEPTED_ATTR,
  ACCEPTED_EXTENSIONS,
  MAX_UPLOAD_BYTES,
  VENDOR_ITINERARY_ENDPOINT,
  VENDOR_UPLOAD_HERO,
  type VendorItineraryResponse,
} from "@/data/vendorItinerary";

type Status = "idle" | "uploading" | "processing" | "success" | "error";

// Stop polling after ~2 min (40 × 3s) so a stuck job never spins forever.
const MAX_POLLS = 40;

function extension(name: string): string {
  return name.includes(".") ? name.split(".").pop()!.toLowerCase() : "";
}

export default function VendorItineraryUpload() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [result, setResult] = useState<VendorItineraryResponse | null>(null);
  const [timedOut, setTimedOut] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const pollCount = useRef(0);

  // ─── Poll for extraction status while the AI works ───────────────
  useEffect(() => {
    if (
      !result ||
      timedOut ||
      result.ai_status === "success" ||
      result.ai_status === "failure"
    ) {
      return;
    }
    const intervalId = setInterval(async () => {
      pollCount.current += 1;
      if (pollCount.current > MAX_POLLS) {
        clearInterval(intervalId);
        setTimedOut(true);
        return;
      }
      try {
        const res = await fetch(`${VENDOR_ITINERARY_ENDPOINT}${result.uuid}/`);
        if (res.ok) {
          const body = await res.json();
          const updated = unwrap<VendorItineraryResponse>(body);
          setResult(updated);
          if (updated.ai_status === "success") setStatus("success");
          if (updated.ai_status === "failure") {
            setStatus("error");
            setErrorMsg(updated.ai_error || "Extraction failed. Please try another file.");
          }
        }
      } catch (err) {
        console.error("Polling error:", err);
      }
    }, 3000);
    return () => clearInterval(intervalId);
  }, [result, timedOut]);

  const reset = () => {
    setStatus("idle");
    setErrorMsg(null);
    setProgress(0);
    setFileName(null);
    setResult(null);
    setTimedOut(false);
    pollCount.current = 0;
    if (inputRef.current) inputRef.current.value = "";
  };

  const validate = (file: File): string | null => {
    if (!ACCEPTED_EXTENSIONS.includes(extension(file.name) as never)) {
      return "Unsupported file type. Upload a PDF, DOCX, PNG, JPG, or JPEG.";
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      return "File is larger than 25 MB.";
    }
    return null;
  };

  const upload = (file: File) => {
    const validationError = validate(file);
    if (validationError) {
      setStatus("error");
      setErrorMsg(validationError);
      return;
    }

    setFileName(file.name);
    setErrorMsg(null);
    setProgress(0);
    setTimedOut(false);
    pollCount.current = 0;
    setStatus("uploading");

    // XMLHttpRequest (not fetch) so we can show real upload progress.
    const xhr = new XMLHttpRequest();
    xhr.open("POST", VENDOR_ITINERARY_ENDPOINT);

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 100));
    };

    xhr.onload = () => {
      let body: unknown = null;
      try {
        body = JSON.parse(xhr.responseText);
      } catch {
        /* non-JSON */
      }
      if (xhr.status >= 200 && xhr.status < 300) {
        const data = unwrap<VendorItineraryResponse>(body);
        setResult(data);
        // Move into "processing" — the poller takes it from here.
        setStatus(data.ai_status === "success" ? "success" : "processing");
      } else {
        setStatus("error");
        if (xhr.status === 429) {
          setErrorMsg("Too many requests. Please try again shortly.");
        } else {
          setErrorMsg(extractError(unwrap(body), "Upload failed. Please try again."));
        }
      }
    };

    xhr.onerror = () => {
      setStatus("error");
      setErrorMsg("Network error during upload. Please try again.");
    };

    const formData = new FormData();
    formData.append("source_file", file);
    xhr.send(formData);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) upload(file);
  };

  // ─── Result view — editable review form ──────────────────────────
  if (status === "success" && result) {
    const initial =
      result.edited_output && Object.keys(result.edited_output).length > 0
        ? result.edited_output
        : result.ai_output;
    return (
      <VendorItineraryReview
        initial={initial}
        uuid={result.uuid}
        refId={result.id}
        filename={result.original_filename}
        onReset={reset}
      />
    );
  }

  // ─── Timed-out view — polling stopped, job may still finish ──────
  if (timedOut) {
    return (
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-20 text-center">
        <h3 className="text-xl font-bold mb-2 font-[family-name:var(--font-playfair)] italic">
          This is taking longer than usual
        </h3>
        <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto">
          The extraction may still be running in the background. You can keep waiting,
          or start over with another file.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <button
            type="button"
            onClick={() => {
              pollCount.current = 0;
              setTimedOut(false);
            }}
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold px-5 py-2.5 rounded-full transition-colors"
          >
            <RefreshCw size={18} /> Keep waiting
          </button>
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-5 py-2.5 rounded-full transition-colors"
          >
            Start over
          </button>
        </div>
      </section>
    );
  }

  // ─── Processing view ─────────────────────────────────────────────
  if (status === "processing" || (status === "uploading" && progress === 100)) {
    return (
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-20 text-center">
        <RefreshCw className="mx-auto h-10 w-10 text-primary animate-spin mb-4" />
        <h3 className="text-xl font-bold mb-2 font-[family-name:var(--font-playfair)] italic">
          Reading the vendor document…
        </h3>
        <p className="text-gray-500 text-sm">
          Stripping branding and extracting the itinerary. This usually takes 20–60 seconds.
        </p>
        {fileName && (
          <p className="mt-4 inline-flex items-center gap-2 text-xs text-gray-400">
            <FileText size={14} /> {fileName}
          </p>
        )}
      </section>
    );
  }

  // ─── Upload view ─────────────────────────────────────────────────
  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      <h1 className="text-2xl sm:text-3xl font-bold leading-tight mb-2 italic font-[family-name:var(--font-playfair)]">
        {VENDOR_UPLOAD_HERO.title}
      </h1>
      <p className="text-sm text-gray-600 mb-8 max-w-xl">{VENDOR_UPLOAD_HERO.subtitle}</p>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setDragActive(false);
        }}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        className={`flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-6 py-16 text-center cursor-pointer transition-colors ${
          dragActive
            ? "border-primary bg-primary/5"
            : "border-gray-300 bg-white hover:border-primary/60"
        }`}
      >
        <UploadCloud className="h-10 w-10 text-primary" />
        <p className="text-sm font-medium text-gray-700">
          Drag &amp; drop a vendor itinerary here, or <span className="text-primary">browse</span>
        </p>
        <p className="text-xs text-gray-400">PDF, DOCX, PNG, JPG or JPEG · up to 25 MB</p>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_ATTR}
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) upload(file);
          }}
        />
      </div>

      {status === "uploading" && (
        <div className="mt-6">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span className="inline-flex items-center gap-2">
              <FileText size={14} /> {fileName}
            </span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {status === "error" && errorMsg && (
        <p className="mt-4 text-sm text-red-600">{errorMsg}</p>
      )}
    </section>
  );
}
