import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

// Dados iniciais falsos
const tarefasIniciais = [
  { id: '1', conteudo: 'Criar o Design' },
  { id: '2', conteudo: 'Configurar Banco de Dados' },
  { id: '3', conteudo: 'Testar a API' },
];

function QuadroKanban() {
  const [tarefas, setTarefas] = useState(tarefasIniciais);

  // Esta é a função MÁGICA. Ela roda quando você solta o mouse.
  const aoTerminarDeArrastar = (result) => {
    // Se o usuário soltou fora de uma coluna, não faz nada
    if (!result.destination) return;

    // Criamos uma cópia da lista atual
    const novosItens = Array.from(tarefas);
    
    // 1. Removemos o item da posição antiga
    const [itemRemovido] = novosItens.splice(result.source.index, 1);
    
    // 2. Inserimos o item na nova posição
    novosItens.splice(result.destination.index, 0, itemRemovido);

    // 3. Atualizamos o Estado do React (Isso faz a tela mudar visualmente)
    setTarefas(novosItens);
  };

  return (
    // A Envoltória Principal
    <DragDropContext onDragEnd={aoTerminarDeArrastar}>
      
      {/* A Coluna onde soltamos coisas */}
      <Droppable droppableId="coluna-tarefas">
        {(provided) => (
          <ul {...provided.droppableProps} ref={provided.innerRef}>
            
            {tarefas.map((tarefa, index) => (
              
              /* Cada Tarefa arrastável */
              <Draggable key={tarefa.id} draggableId={tarefa.id} index={index}>
                {(provided) => (
                  <li
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={{ ...provided.draggableProps.style, padding: 16, margin: '0 0 8px 0', background: 'white' }}
                  >
                    {tarefa.conteudo}
                  </li>
                )}
              </Draggable>

            ))}
            {provided.placeholder}
          </ul>
        )}
      </Droppable>

    </DragDropContext>
  );
}