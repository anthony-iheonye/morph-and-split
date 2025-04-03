import { Card, CardBody, Skeleton, SkeletonText } from "@chakra-ui/react";

/**
 * PreviewCardSkeleton displays a placeholder skeleton UI for the PreviewCard component.
 *
 * This skeleton is used during loading states to indicate that image and metadata
 * content is being fetched or processed.
 */
const PreviewCardSkeleton = () => {
  return (
    <Card>
      <Skeleton height="170px" />
      <CardBody>
        <SkeletonText fontSize="sm" />
      </CardBody>
    </Card>
  );
};

export default PreviewCardSkeleton;
