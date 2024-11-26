import { createBrowserRouter } from "react-router-dom";
import AugmentationSettings from "./pages/AugmentationSettings";
import DataSplitterSlider from "./pages/DataSplit";
import ImageUpload from "./pages/ImageUpload";
import InitiateAugmentation from "./pages/InitiateAugmentation";
import Layout from "./pages/Layout";
import MaskUpload from "./pages/MaskUpload";
import PreProcessing from "./pages/Preprocessing";
import Preview from "./pages/Preview";
import StartAugmentation from "./pages/StartAugmentation";
import AugTransformationsInput from "./pages/Transformations";
import UploadData from "./pages/UploadData";
import VisualAttributes from "./pages/VisualAttributes";
import PreviewAugmentedResults from "./pages/PreviewAugmentedResults";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "upload_data",
        element: <UploadData />,
        children: [
          {
            path: "",
            element: <ImageUpload />,
          },
          {
            path: "images",
            element: <ImageUpload />,
          },
          {
            path: "masks",
            element: <MaskUpload />,
          },
          { path: "preview", element: <Preview /> },
        ],
      },
      {
        path: "settings",
        element: <AugmentationSettings />,
        children: [
          {
            path: "",
            element: <DataSplitterSlider labelweight="normal" />,
          },
          {
            path: "data_split",
            element: <DataSplitterSlider labelweight="normal" />,
          },
          {
            path: "select_transformation",
            element: <AugTransformationsInput />,
          },
          { path: "visual_attributes", element: <VisualAttributes /> },
          { path: "pre_processing", element: <PreProcessing /> },
        ],
      },
      {
        path: "augment",
        element: <InitiateAugmentation />,
        children: [
          {
            path: "",
            element: <StartAugmentation />,
          },
          {
            path: "start_augmentation",
            element: <StartAugmentation />,
          },
          {
            path: "preview",
            element: <PreviewAugmentedResults />,
          },
        ],
      },
    ],
  },
]);

export default router;
