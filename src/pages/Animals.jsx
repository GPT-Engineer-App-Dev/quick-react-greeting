import { useState } from 'react';
import { useAnimals, useAddAnimal, useUpdateAnimal, useDeleteAnimal } from '../integrations/supabase/index.js';
import { Box, Button, FormControl, FormLabel, Input, Table, Tbody, Td, Th, Thead, Tr, VStack } from '@chakra-ui/react';

const Animals = () => {
  const { data: animals, isLoading, isError } = useAnimals();
  const addAnimal = useAddAnimal();
  const updateAnimal = useUpdateAnimal();
  const deleteAnimal = useDeleteAnimal();

  const [formState, setFormState] = useState({
    id: null,
    name: '',
    type: '',
    size: '',
    country_of_origin: '',
    average_lifetime: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formState.id) {
        await updateAnimal.mutateAsync(formState);
      } else {
        await addAnimal.mutateAsync(formState);
      }
      setFormState({
        id: null,
        name: '',
        type: '',
        size: '',
        country_of_origin: '',
        average_lifetime: '',
      });
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleEdit = (animal) => {
    setFormState(animal);
  };

  const handleDelete = (id) => {
    deleteAnimal.mutate(id);
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading animals</div>;

  return (
    <Box p={4}>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl>
            <FormLabel>Name</FormLabel>
            <Input name="name" value={formState.name} onChange={handleChange} />
          </FormControl>
          <FormControl>
            <FormLabel>Type</FormLabel>
            <Input name="type" value={formState.type} onChange={handleChange} />
          </FormControl>
          <FormControl>
            <FormLabel>Size</FormLabel>
            <Input name="size" value={formState.size} onChange={handleChange} />
          </FormControl>
          <FormControl>
            <FormLabel>Country of Origin</FormLabel>
            <Input name="country_of_origin" value={formState.country_of_origin} onChange={handleChange} />
          </FormControl>
          <FormControl>
            <FormLabel>Average Lifetime</FormLabel>
            <Input name="average_lifetime" value={formState.average_lifetime} onChange={handleChange} />
          </FormControl>
          <Button type="submit" colorScheme="teal">
            {formState.id ? 'Update Animal' : 'Add Animal'}
          </Button>
        </VStack>
      </form>

      <Table mt={8}>
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Type</Th>
            <Th>Size</Th>
            <Th>Country of Origin</Th>
            <Th>Average Lifetime</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {animals.map((animal) => (
            <Tr key={animal.id}>
              <Td>{animal.name}</Td>
              <Td>{animal.type}</Td>
              <Td>{animal.size}</Td>
              <Td>{animal.country_of_origin}</Td>
              <Td>{animal.average_lifetime}</Td>
              <Td>
                <Button size="sm" onClick={() => handleEdit(animal)}>
                  Edit
                </Button>
                <Button size="sm" colorScheme="red" onClick={() => handleDelete(animal.id)}>
                  Delete
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default Animals;