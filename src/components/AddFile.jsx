import React, { useState, useEffect } from "react";
import {
  listAll,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import storage from "../firebase";
import { Button, ScrollArea } from "@mantine/core";
import { Document, Page } from "react-pdf";
import { pdfjs } from "react-pdf";
import { IconFileFilled } from "@tabler/icons-react";
import { IconBrandWhatsapp } from "@tabler/icons-react";

// Set worker path for PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const AddFile = () => {
  const [fileList, setFileList] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [hoveredFile, setHoveredFile] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);

  useEffect(() => {
    fetchFiles();
    checkMobileOrTablet();
    window.addEventListener("resize", checkMobileOrTablet);
    return () => window.removeEventListener("resize", checkMobileOrTablet);
  }, []);

  const checkMobileOrTablet = () => {
    const isMobileOrTablet =
      window.innerWidth <= 1024 && window.innerHeight <= 1024;
    setIsMobileOrTablet(isMobileOrTablet);
  };

  const fetchFiles = async () => {
    try {
      const storageRef = ref(storage, "community platform");
      const filesList = await listAll(storageRef);

      const files = await Promise.all(
        filesList.items.map(async (fileRef) => {
          const url = await getDownloadURL(fileRef);
          return {
            filename: fileRef.name,
            url: url,
          };
        })
      );

      setFileList(files);
    } catch (error) {
      console.error("Error fetching files: ", error);
    }
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.type !== "application/pdf") {
      alert("Please select a PDF file");
      return;
    }
    setSelectedFile(selectedFile);
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file");
      return;
    }

    try {
      const storageRef = ref(
        storage,
        "community platform/" + selectedFile.name
      );
      await uploadBytesResumable(storageRef, selectedFile);
      alert("File uploaded successfully!");
      fetchFiles();
    } catch (error) {
      console.error("Error uploading file: ", error);
      alert("An error occurred while uploading the file.");
    }
  };

  const handleFileClick = (file) => {
    setSelectedFile(file);

    if (isMobileOrTablet) {
      window.open(file.url, "_blank");
    }
  };

  const handleDeleteFile = async (filename) => {
    try {
      const storageRef = ref(storage, `community platform/${filename}`);
      await deleteObject(storageRef);
      console.log("File deleted successfully");
      setSelectedFile(null);
      fetchFiles();
    } catch (error) {
      console.error("Error deleting file: ", error);
      alert("An error occurred while deleting the file.");
    }
  };

  const handleJoinCommunity = () => {
    window.open("https://chat.whatsapp.com/KhcqRxM6R54HRliKOwFwgy", "_blank");
  };
  const handlePlayStore = () => {
    window.open(
      "https://play.google.com/store/apps/details?id=com.examSathi.examSathi",
      "_blank"
    );
  };

  const handleshare = (file) => {
    const message = `Check out this PDF: `;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
      `Mitra *${file.filename}* PDF hya link varun direct download kar ani ajun khup saare pan aahet check kar\nexamsathi.netlify.app`
    )}`;
    const link = document.createElement("a");
    link.href = whatsappUrl;
    link.target = "_blank";
    link.click();
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  return (
    <div className="p-2">
      <div className="flex justify-center items-center space-x-3">
        <img
          src="/logo512.png"
          alt="Exam Sathi"
          className="w-14 h-14 rounded-md"
        />
        <h1 className="text-center text-3xl font-bold text-blue-900">
          EXAM SATHI
        </h1>
      </div>
      <h3 className="text-center my-2 underline text-lg text-purple-700 font-semibold">
        सर्व स्पर्धा परीक्षेचे important notes आणि PDF इथे मिळतील अगदी Free.
      </h3>
      <div className="flex items-center space-x-2 mb-4">
        <input
          type="file"
          onChange={handleFileChange}
          className="rounded p-3"
          accept=".pdf"
        />
        <button
          onClick={handleFileUpload}
          className="px-4 py-2 rounded bg-blue-500 text-white"
        >
          Upload!
        </button>
      </div>
      <div className="flex flex-col lg:flex-row">
        <div className="w-full lg:w-2/5">
          <ScrollArea h={700}>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border">
              {fileList.map((file) => (
                <div
                  key={file.filename}
                  className="flex flex-col items-center relative text-center p-2 cursor-pointer"
                  onClick={() => handleFileClick(file)}
                  onMouseEnter={() => setHoveredFile(file)}
                  onMouseLeave={() => setHoveredFile(null)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="icon icon-tabler icon-tabler-file-filled"
                    className="w-24 h-24"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                    stroke="currentColor"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <path
                      d="M12 2l.117 .007a1 1 0 0 1 .876 .876l.007 .117v4l.005 .15a2 2 0 0 0 1.838 1.844l.157 .006h4l.117 .007a1 1 0 0 1 .876 .876l.007 .117v9a3 3 0 0 1 -2.824 2.995l-.176 .005h-10a3 3 0 0 1 -2.995 -2.824l-.005 -.176v-14a3 3 0 0 1 2.824 -2.995l.176 -.005h5z"
                      stroke-width="0"
                      fill="currentColor"
                    ></path>
                    <path
                      d="M19 7h-4l-.001 -4.001z"
                      stroke-width="0"
                      fill="currentColor"
                    ></path>
                  </svg>
                  <span>{file.filename}</span>
                  <button
                    onClick={() => handleshare(file)}
                    className="absolute top-0 right-0 p-1"
                  >
                    <IconBrandWhatsapp size={30} stroke="green" color="green" />
                  </button>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
        {!isMobileOrTablet && (
          <div className="w-full lg:w-3/5 mt-4 lg:mt-0">
            {selectedFile ? (
              <div>
                <h3>Selected File: {selectedFile.filename}</h3>
                <embed
                  src={selectedFile.url}
                  width="100%"
                  height="900px"
                  type="application/pdf"
                />
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <h1>No Preview</h1>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="flex flex-col md:flex-row ">
        <div className="fixed bottom-16 md:left-auto md:right-0 md:top-1/2 md:translate-y-[-50%] z-20 m-1">
          <div className="w-full md:w-auto bg-green-500 text-white p-4 rounded-lg shadow-lg flex items-center justify-center space-x-2">
            <IconBrandWhatsapp size={30} />
            <button onClick={handleJoinCommunity} className="text-white">
              Whatsapp जॉईन करा
            </button>
          </div>
        </div>
        <div className="fixed bottom-0 left-0 md:left-4 md:bottom-4 w-full md:w-auto bg-[#504E4E] text-white p-4 rounded-lg shadow-lg flex items-center justify-start space-x-2 mt-2 md:mt-0">
          <img src="/logo512.png" alt="Exam Sathi" className="w-10 h-10" />
          <button onClick={handlePlayStore} className="text-white text-sm">
            अशे अजून 500+ free PDFs, books, past papers आणि free doubt solving
            साठी इथे click करा
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddFile;
