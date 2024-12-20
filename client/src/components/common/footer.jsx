import {
  Box,
  Flex,
  Link,
  Image,
  Text,
  VStack,
  HStack,
  Icon,
} from '@chakra-ui/react';
import Brand from './brand';

const footerData = [
  {
    title: 'Company Name',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  },
  {
    title: 'Services',
    links: [
      { text: 'About', href: '#' },
      { text: 'Return Policy', href: '#' },
      { text: 'Customer Services', href: '#' },
    ],
  },
  {
    title: 'Useful Links',
    links: [
      { text: 'Thanks', href: '#' },
      { text: 'Shipping', href: '#' },
      { text: 'Create a Program', href: '#' },
    ],
  },
  {
    title: 'Contact Us',
    contacts: [
      { icon: 'fas fa-map-marker-alt', text: 'Address' },
      { icon: 'fas fa-phone', text: 'Phone Number' },
      { icon: 'fas fa-envelope', text: 'Email' },
    ],
  },
];

const Footer = () => (
  <Box bg="gray.900" color="white" pt={12}>
    <Flex justify="space-between" align="center" maxW="1300px" mx="auto" px={4}>
      <Brand />
      <Flex align="start"  gap={'30px'} justifyContent={'space-evenly'}>
        {footerData.map((section, index) => (
          <Flex key={index} direction="column" align="start" mb={4} gap={'20px'}>
            <Text fontSize="lg" fontWeight="bold">
              {section.title}
            </Text>
            {section.description && (
              <Text fontSize="sm" color="gray.400" >
                {section.description}
              </Text>
            )}
            {section.links && (
              <Flex direction="column" align="start" gap={'10px'}>
                {section.links.map((link, linkIndex) => (
                  <Link key={linkIndex} href={link.href} color="white" mb={2}>
                    {link.text}
                  </Link>
                ))}
              </Flex>
            )}
            {section.contacts && (
              <Flex direction="column" align="start" gap={'15px'}>
                {section.contacts.map((contact, contactIndex) => (
                  <Flex key={contactIndex} align="start" mb={2} gap={'5px'}>
                    <Icon name={contact.icon} size={20} mr={2} />
                    <Text fontSize="sm" color="gray.400">
                      {contact.text}
                    </Text>
                  </Flex>
                ))}
              </Flex>
            )}
          </Flex>
        ))}
      </Flex>
    </Flex>
    <Flex justify="center" align="center" py={4}>
      <Text fontSize="sm" color="gray.400">
        &copy; 2022 Company Name. All rights reserved.
      </Text>
    </Flex>
  </Box>
);

export default Footer;