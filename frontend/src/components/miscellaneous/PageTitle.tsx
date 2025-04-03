import { Heading } from "@chakra-ui/react";

/**
 * Props for the PageTitle component.
 */
interface Props {
  /** Title text to display as the page heading */
  title: string;
}

/**
 * PageTitle is a centered heading component for rendering a page or section title.
 *
 */
const PageTitle = ({ title }: Props) => {
  return (
    <Heading
      as="h3"
      size="md"
      width="100%"
      textAlign="center"
      fontWeight="medium"
    >
      {title}
    </Heading>
  );
};

export default PageTitle;
