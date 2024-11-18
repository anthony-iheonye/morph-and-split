import { createBrowserRouter } from "react-router-dom";
import AugSettingsForm from "./components/AugSettingsForm";
import AugmentationSettings from "./pages/AugmentationSettings";
import Layout from "./pages/Layout";
import DataSplitterSlider from "./components/formInputs/DataSplitterSlider";

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
          { path: "select_transformation", element: <AugSettingsForm /> },
          { path: "visual_attributes_file", element: <AugSettingsForm /> },
          { path: "pre_processing", element: <AugSettingsForm /> },
        ],
      },
    ],
  },
]);

export default router;
