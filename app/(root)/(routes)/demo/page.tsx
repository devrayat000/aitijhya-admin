"use client";

import { PDFDocument } from "pdf-lib";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import { Suspense, use } from "react";
import "@react-pdf-viewer/core/lib/styles/index.css";

const pdfUrl =
  "https://f2bibviistc9jhwx.public.blob.vercel-storage.com/books/%E0%A6%B0%E0%A6%95%E0%A7%8D%E0%A6%A4-%E0%A6%93-%E0%A6%B8%E0%A6%9E%E0%A7%8D%E0%A6%9A%E0%A6%BE%E0%A6%B2%E0%A6%A8%20(1)-2brkYoEmGvXmazG3yEQWNnHrnACU5l.pdf";

async function splitPdf(pdfUrl: string, page: number) {
  const existingPdfBytes = await fetch(pdfUrl, { cache: "force-cache" }).then(
    (res) => res.arrayBuffer()
  );
  const bytes = new Uint8Array(existingPdfBytes);
  const pdfSrcDoc = await PDFDocument.load(bytes);
  const pdfNewDoc = await PDFDocument.create();
  const pages = await pdfNewDoc.copyPages(pdfSrcDoc, [page]);
  pages.forEach((page) => pdfNewDoc.addPage(page));
  const newpdf = await pdfNewDoc.save();
  const url = Buffer.from(newpdf).toString("base64");
  // console.log(url.slice(0, 100));

  return "data:application/pdf;base64," + url;
}

function Recognizer() {
  const url = use(splitPdf(pdfUrl, 2));

  return (
    <div
      style={{
        height: "750px",
        width: "900px",
        marginLeft: "auto",
        marginRight: "auto",
      }}
    >
      <iframe src={url} frameBorder={0} />
      {/* <Viewer
        fileUrl={
          "https://f2bibviistc9jhwx.public.blob.vercel-storage.com/books/%E0%A6%B0%E0%A6%95%E0%A7%8D%E0%A6%A4-%E0%A6%93-%E0%A6%B8%E0%A6%9E%E0%A7%8D%E0%A6%9A%E0%A6%BE%E0%A6%B2%E0%A6%A8%20(1)-2brkYoEmGvXmazG3yEQWNnHrnACU5l.pdf"
        }
        plugins={[defaultLayoutPlugin()]}
      /> */}
    </div>
  );
}

export default function DemoPage() {
  return (
    <div suppressHydrationWarning>
      {/* <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js"> */}
      <Suspense>
        <Recognizer />
      </Suspense>
      {/* </Worker> */}
    </div>
  );
}
