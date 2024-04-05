import { PDFDocument } from "pdf-lib";
import { cache } from "react";

const splitPdf = cache(async (pdfUrl: string, page: number) => {
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
});

export default splitPdf;
