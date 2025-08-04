import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Upload, Move, RotateCw, Trash2 } from 'lucide-react';
import { Canvas as FabricCanvas, FabricImage, Circle, Rect } from 'fabric';
import { IMPRINT_METHODS } from '@/types/imprint';
import { toast } from 'sonner';

interface ProductCustomizerProps {
  productImage?: string;
  onSaveDesign: (designData: any) => void;
}

export function ProductCustomizer({ productImage, onSaveDesign }: ProductCustomizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [selectedMethod, setSelectedMethod] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [designPosition, setDesignPosition] = useState({ x: 50, y: 50 });
  const [designSize, setDesignSize] = useState({ width: 100, height: 100 });

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: 400,
      height: 500,
      backgroundColor: '#f8f9fa',
    });

    // Load product image if provided
    if (productImage) {
      FabricImage.fromURL(productImage).then((img) => {
        img.set({
          left: 0,
          top: 0,
          scaleX: 400 / (img.width || 400),
          scaleY: 500 / (img.height || 500),
          selectable: false,
          evented: false
        });
        canvas.add(img);
        canvas.renderAll();
      });
    }

    setFabricCanvas(canvas);

    return () => {
      canvas.dispose();
    };
  }, [productImage]);

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLogoFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      if (fabricCanvas && imageUrl) {
        FabricImage.fromURL(imageUrl).then((img) => {
          img.set({
            left: designPosition.x,
            top: designPosition.y,
            scaleX: designSize.width / (img.width || 100),
            scaleY: designSize.height / (img.height || 100),
          });
          fabricCanvas.add(img);
          fabricCanvas.setActiveObject(img);
          fabricCanvas.renderAll();
          toast('Logo uploaded successfully');
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const addShape = (type: 'rectangle' | 'circle') => {
    if (!fabricCanvas) return;

    let shape;
    if (type === 'rectangle') {
      shape = new Rect({
        left: 200,
        top: 250,
        fill: '#3b82f6',
        width: 100,
        height: 60,
      });
    } else {
      shape = new Circle({
        left: 200,
        top: 250,
        fill: '#3b82f6',
        radius: 50,
      });
    }

    fabricCanvas.add(shape);
    fabricCanvas.setActiveObject(shape);
    fabricCanvas.renderAll();
  };

  const deleteSelected = () => {
    if (!fabricCanvas) return;
    const activeObject = fabricCanvas.getActiveObject();
    if (activeObject) {
      fabricCanvas.remove(activeObject);
      fabricCanvas.renderAll();
    }
  };

  const rotateSelected = () => {
    if (!fabricCanvas) return;
    const activeObject = fabricCanvas.getActiveObject();
    if (activeObject) {
      activeObject.rotate((activeObject.angle || 0) + 45);
      fabricCanvas.renderAll();
    }
  };

  const saveDesign = () => {
    if (!fabricCanvas) return;

    const designData = {
      method: selectedMethod,
      logoFile: logoFile,
      canvasData: fabricCanvas.toJSON(),
      preview: fabricCanvas.toDataURL(),
      position: designPosition,
      size: designSize
    };

    onSaveDesign(designData);
    toast('Design saved successfully');
  };

  const getMethodConfig = (methodValue: string) => {
    return IMPRINT_METHODS.find(m => m.value === methodValue);
  };

  return (
    <div className="grid grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Design Canvas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border rounded-lg p-4 bg-gray-50">
              <canvas ref={canvasRef} className="border rounded" />
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => addShape('rectangle')}>
                Rectangle
              </Button>
              <Button variant="outline" size="sm" onClick={() => addShape('circle')}>
                Circle
              </Button>
              <Button variant="outline" size="sm" onClick={rotateSelected}>
                <RotateCw className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={deleteSelected}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Design Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label>Print Method</Label>
            <Select value={selectedMethod} onValueChange={setSelectedMethod}>
              <SelectTrigger>
                <SelectValue placeholder="Select print method" />
              </SelectTrigger>
              <SelectContent>
                {IMPRINT_METHODS.map(method => (
                  <SelectItem key={method.value} value={method.value}>
                    {method.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedMethod && (
              <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm font-medium">Requirements:</p>
                <p className="text-sm text-muted-foreground">
                  {getMethodConfig(selectedMethod)?.instructions}
                </p>
                <div className="mt-2">
                  {getMethodConfig(selectedMethod)?.requirements?.map((req, idx) => (
                    <Badge key={idx} variant="secondary" className="mr-1 mb-1">
                      {req}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="logo-upload">Upload Logo</Label>
            <div className="mt-2">
              <Input
                id="logo-upload"
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
              <Button
                variant="outline"
                onClick={() => document.getElementById('logo-upload')?.click()}
                className="w-full"
              >
                <Upload className="h-4 w-4 mr-2" />
                Choose Logo File
              </Button>
              {logoFile && (
                <p className="text-sm text-muted-foreground mt-1">
                  {logoFile.name}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Position X</Label>
              <Input
                type="number"
                value={designPosition.x}
                onChange={(e) => setDesignPosition({
                  ...designPosition,
                  x: Number(e.target.value)
                })}
              />
            </div>
            <div>
              <Label>Position Y</Label>
              <Input
                type="number"
                value={designPosition.y}
                onChange={(e) => setDesignPosition({
                  ...designPosition,
                  y: Number(e.target.value)
                })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Width</Label>
              <Input
                type="number"
                value={designSize.width}
                onChange={(e) => setDesignSize({
                  ...designSize,
                  width: Number(e.target.value)
                })}
              />
            </div>
            <div>
              <Label>Height</Label>
              <Input
                type="number"
                value={designSize.height}
                onChange={(e) => setDesignSize({
                  ...designSize,
                  height: Number(e.target.value)
                })}
              />
            </div>
          </div>

          <Button onClick={saveDesign} className="w-full">
            Save Design
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}