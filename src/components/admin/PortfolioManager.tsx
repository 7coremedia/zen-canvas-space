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
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading portfolio items...</p>
          </div>
        </div>
      </Card>
    );
  }

  if (!portfolioItems || portfolioItems.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center py-12">
          <div className="mb-4">
            <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
              <Edit2 className="w-8 h-8 text-muted-foreground" />
            </div>
          </div>
          <h3 className="text-lg font-semibold mb-2">No portfolio items yet</h3>
          <p className="text-muted-foreground mb-6">
            Get started by adding your first portfolio item to showcase your work.
          </p>
          <Button onClick={() => navigate("/management/portfolio/new")}>
            <Edit2 className="w-4 h-4 mr-2" />
            Add First Item
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 rounded-xl">
      <div className="rounded-lg border overflow-hidden">
        <DragDropContext onDragEnd={handleDragEnd} onDragStart={() => setIsDragging(true)}>
          <Droppable droppableId="portfolio-items">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      {role?.is_admin && <TableCell className="w-12"></TableCell>}
                      <TableCell className="font-semibold">Title</TableCell>
                      <TableCell className="font-semibold">Category</TableCell>
                      <TableCell className="font-semibold">Status</TableCell>
                      <TableCell className="font-semibold">Created</TableCell>
                      <TableCell className="font-semibold w-24">Actions</TableCell>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {portfolioItems.map((item, index) => (
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
                            className={`${snapshot.isDragging ? "bg-accent shadow-lg" : "hover:bg-muted/50"} transition-colors`}
                          >
                            {role?.is_admin && (
                              <TableCell>
                                <div {...provided.dragHandleProps} className="cursor-grab active:cursor-grabbing">
                                  <GripVertical className="w-4 h-4 text-muted-foreground" />
                                </div>
                              </TableCell>
                            )}
                            <TableCell className="font-medium">{item.title}</TableCell>
                            <TableCell>
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {item.category}
                              </span>
                            </TableCell>
                            <TableCell>
                              {item.is_published ? (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  Published
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                  Draft
                                </span>
                              )}
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {new Date(item.created_at).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => navigate(`/management/portfolio/${item.id}`)}
                                  className="h-8 w-8 p-0 hover:bg-blue-100"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </Button>
                                {role?.is_admin && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => deleteItem(item.id)}
                                    className="h-8 w-8 p-0 hover:bg-red-100"
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
      </div>
    </Card>
  );
}