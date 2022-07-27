import { useEffect, useState } from "react";

import api from "../../services/api";

import Header from "../../components/Header";
import Food from "../../components/Food";
import ModalAddFood from "../../components/ModalAddFood";
import ModalEditFood from "../../components/ModalEditFood";

import { AddFoodType, FoodType, UpdateFoodType } from "../../types/food.types";
import { FoodsContainer } from "./styles";

const Dashboard = () => {
  const [foods, setFoods] = useState<Array<FoodType>>();
  const [editingFood, setEditingFood] = useState<FoodType>();
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const handleAddFood = async (food: AddFoodType) => {
    try {
      const response = await api.post<FoodType>("/foods", {
        ...food,
        available: true,
      });

      if (foods) {
        setFoods([...foods, response.data]);
      }
    } catch (error) {
      alert(error);
    }
  };

  const handleUpdateFood = async (food: UpdateFoodType) => {
    try {
      const foodUpdated = await api.put<FoodType>(`/foods/${editingFood?.id}`, {
        ...editingFood,
        ...food,
      });

      const foodsUpdated = foods?.map((f) =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data
      );

      setFoods(foodsUpdated);
    } catch (err) {
      alert(err);
    }
  };

  const handleDeleteFood = async (id: number) => {
    await api.delete(`/foods/${id}`);

    const foodsFiltered = foods?.filter((food) => food.id !== id);

    setFoods(foodsFiltered);
  };

  const toggleModal = () => {
    setModalOpen((oldState) => !oldState);
  };

  const toggleEditModal = () => {
    setEditModalOpen((oldState) => !oldState);
  };

  const handleEditFood = (food: FoodType) => {
    setEditingFood(food);
    setEditModalOpen(true);
  };

  useEffect(() => {
    const fetchFoods = async () => {
      const response = await api.get<Array<FoodType>>("/foods");
      setFoods(response.data);
    };

    fetchFoods();
  }, []);

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      {editingFood && (
        <ModalEditFood
          isOpen={editModalOpen}
          setIsOpen={toggleEditModal}
          editingFood={editingFood}
          handleUpdateFood={handleUpdateFood}
        />
      )}

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map((food) => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
};

export default Dashboard;
