import { Card, CardBody, Skeleton, SkeletonText } from "@chakra-ui/react";

/**
 * PreviewSkeleton provides a loading placeholder for content previews.
 *
 * It mimics the layout of an image preview card while data is being fetched or processed.
 */
const PreviewSkeleton = () => {
  return (
    <Card>
      <Skeleton height="200px" />
      <CardBody>
        <SkeletonText />
      </CardBody>
    </Card>
  );
};

export default PreviewSkeleton;
