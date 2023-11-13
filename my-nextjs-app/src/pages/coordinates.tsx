import React, { useState, createRef, useEffect } from "react";
import Cropper, { ReactCropperElement } from "react-cropper";
// import "cropperjs/dist/cropper.css";
// import Image from "next/image";
// import small from "public/small.jpg";

// const defaultSrc = "/small.jpg";

// export const InputCoordinates: React.FC = () => {
//   const [image, setImage] = useState(defaultSrc);
//   const [cropData, setCropData] = useState("#");
//   const cropperRef = createRef<ReactCropperElement>();
//   const [latitude, setLatitude] = useState(0);
//   const [longitude, setLongitude] = useState(0);
//   const [date, setDate] = useState(0);
//   const [cropped, setCropped] = useState(false);
//   const [croppedCoords, setCroppedCoords] = useState({
//     x1: 0,
//     y1: 0,
//     x2: 0,
//     y2: 0,
//   });

//   function handleLatitudeChange(e) {
//     setLatitude(e.target.value);
//   }
//   function handleLongitudeChange(e) {
//     setLongitude(e.target.value);
//   }

//   function handleDateChange(e) {
//     setDate(e.target.value);
//   }

//   //x1,y1 is top right, x2,y2 is bottom left
//   function getDistance() {
//     const x1 = croppedCoords.x1;
//     const x2 = croppedCoords.x2;
//     const y1 = croppedCoords.y1;
//     const y2 = croppedCoords.y2;

//     const x_dist_real = (x1 - x2) * 10000;
//     const y_dist_real = (y2 - y1) * 10000;
//   }

//   useEffect(() => {
//     console.log(croppedCoords);
//     getDistance();
//   }, [croppedCoords]);

//   const getCropData = () => {
//     if (typeof cropperRef.current?.cropper !== "undefined") {
//       console.log(typeof cropperRef.current?.cropper.getCanvasData());
//       const coords = {
//         x1:
//           (cropperRef.current?.cropper.getCropBoxData().left +
//             cropperRef.current?.cropper.getCropBoxData().width) /
//           cropperRef.current?.cropper.getContainerData().width,
//         y1:
//           cropperRef.current?.cropper.getCropBoxData().top /
//           cropperRef.current?.cropper.getContainerData().height,
//         x2:
//           cropperRef.current?.cropper.getCropBoxData().left /
//           cropperRef.current?.cropper.getContainerData().width,
//         y2:
//           (cropperRef.current?.cropper.getCropBoxData().top +
//             cropperRef.current?.cropper.getCropBoxData().height) /
//           cropperRef.current?.cropper.getContainerData().height,
//       };
//       setCroppedCoords(coords);
//       console.log(
//         cropperRef.current?.cropper.getContainerData().height,
//         "container height"
//       );
//       console.log(
//         cropperRef.current?.cropper.getContainerData().width,
//         "container width"
//       );
//       console.log(
//         cropperRef.current?.cropper.getCropBoxData().height,
//         "cropbox height"
//       );
//       console.log(
//         cropperRef.current?.cropper.getCropBoxData().width,
//         "cropbox width"
//       );
//       console.log(cropperRef.current?.cropper.getCropBoxData(), "cropbox data");
//       setCropData(cropperRef.current?.cropper.getCroppedCanvas().toDataURL());
//     }
//     setCropped(true);
//   };

//   return (
//     <div className="flex w-screen h-screen flex-col ">
//       <div className="flex flex-row w-full flex-wrap ">
//         <div className="flex flex-col m-5">
//           <p>Latitude</p>
//           <input
//             type="text"
//             className="border-black border"
//             onChange={handleLatitudeChange}
//           ></input>
//         </div>
//         <div className="flex flex-col m-5">
//           <p>Longitude</p>
//           <input
//             type="text"
//             className="border-black border"
//             onChange={handleLongitudeChange}
//           ></input>
//         </div>
//         <input
//           type="date"
//           className="h-[2rem] mt-10 border-black border"
//           onChange={handleDateChange}
//         ></input>
//       </div>
//       <button
//         // onClick={handleImage}
//         onClick={getCropData}
//         className="w-fit border border-black p-2 m-5"
//       >
//         Crop
//       </button>

//       <div className="flex flex-row w-screen">
//         <Cropper
//           ref={cropperRef}
//           // style={{ height: "10rem", width: "10rem" }}
//           className="w-[400px] h-[400px] m-5"
//           // zoomTo={0.05}
//           zoomable={false}
//           initialAspectRatio={1}
//           preview=".img-preview"
//           src={image}
//           viewMode={1}
//           minCropBoxHeight={2}
//           minCropBoxWidth={2}
//           background={false}
//           responsive={true}
//           autoCropArea={0.5}
//           checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
//           guides={true}
//         />
//         {cropped ? (
//           <img
//             className="w-[25rem] h-[25rem] object-contain m-5"
//             src={cropData}
//             alt="cropped"
//           />
//         ) : null}
//       </div>
//     </div>
//   );
// };

// export default InputCoordinates;
