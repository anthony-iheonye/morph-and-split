import { Card, CardBody, Skeleton, SkeletonText } from "@chakra-ui/react";

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
