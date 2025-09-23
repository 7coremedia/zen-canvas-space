import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/hooks/usePortfolioAuth";
import { usePortfolioItems } from "@/hooks/usePortfolio";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit2, Trash2, GripVertical } from "lucide-react";

export default function PortfolioManager() {
  const navigate = useNavigate();
  const { role } = useUser();
  const { data: portfolioItems, isLoading, updateOrder, deleteItem } = usePortfolioItems();
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(portfolioItems);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update order in Supabase
    updateOrder(items.map((item, index) => ({
      id: item.id,
      order_index: index,
    })));
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Card className="p-6">
      <DragDropContext onDragEnd={handleDragEnd} onDragStart={() => setIsDragging(true)}>
        <Droppable droppableId="portfolio-items">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              <Table>
                <TableHeader>
                  <TableRow>
                    {role?.is_admin && <TableCell style={{ width: 50 }}></TableCell>}
                    <TableCell>Title</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Created</TableCell>
                    <TableCell style={{ width: 100 }}>Actions</TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {portfolioItems?.map((item, index) => (
                    <Draggable 
                      key={item.id} 
                      draggableId={item.id} 
                      index={index}
                      isDragDisabled={!role?.is_admin}
                    >
                      {(provided, snapshot) => (
                        <TableRow
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={snapshot.isDragging ? "bg-accent" : ""}
                        >
                          {role?.is_admin && (
                            <TableCell>
                              <div {...provided.dragHandleProps}>
                                <GripVertical className="w-4 h-4 text-gray-400" />
                              </div>
                            </TableCell>
                          )}
                          <TableCell>{item.title}</TableCell>
                          <TableCell>{item.category}</TableCell>
                          <TableCell>
                            {item.is_published ? (
                              <span className="text-green-600">Published</span>
                            ) : (
                              <span className="text-yellow-600">Draft</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {new Date(item.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => navigate('/dashboard/portfolio/' + item.id)}
                              >
                                <Edit2 className="w-4 h-4" />
                              </Button>
                              {role?.is_admin && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => deleteItem(item.id)}
                                >
                                  <Trash2 className="w-4 h-4 text-red-500" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </TableBody>
              </Table>
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </Card>
  );
}