import { createBrowserRouter } from "react-router-dom";
import AugSettingsForm from "./components/AugSettingsForm";
import AugmentationSettings from "./pages/AugmentationSettings";
import Layout from "./pages/Layout";
import DataSplitterSlider from "./pages/DataSplit";
import AugTransformationsInput from "./pages/Transformations";
import UploadData from "./pages/UploadData";
import Preview from "./pages/Preview";
import ImageUpload from "./pages/ImageUpload";
import MaskUpload from "./pages/MaskUpload";
import VisualAttributes from "./pages/VisualAttributes";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/settings",
        element: <AugmentationSettings />,
        children: [
          {
            path: "data_split",
            element: <DataSplitterSlider labelweight="normal" />,
          },
          {
            path: "select_transformation",
            element: <AugTransformationsInput />,
          },
          { path: "visual_attributes", element: <VisualAttributes /> },
          { path: "pre_processing", element: <AugSettingsForm /> },
        ],
      },
      {
        path: "/upload_data",
        element: <UploadData />,
        children: [
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
    ],
  },
]);

export default router;
