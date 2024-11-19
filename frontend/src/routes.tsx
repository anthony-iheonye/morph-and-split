import { createBrowserRouter } from "react-router-dom";
import AugSettingsForm from "./components/AugSettingsForm";
import AugmentationSettings from "./pages/AugmentationSettings";
import Layout from "./pages/Layout";
import DataSplitterSlider from "./pages/DataSplit";
import AugTransformationsInput from "./pages/Transformations";

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
          { path: "visual_attributes_file", element: <AugSettingsForm /> },
          { path: "pre_processing", element: <AugSettingsForm /> },
        ],
      },
    ],
  },
]);

export default router;
