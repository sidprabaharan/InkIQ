
import React from "react";
import { Image, File, PenTool, Code, Folder, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ArtworkFile {
  name: string;
  date: string;
  size: string;
}

interface ArtworkFiles {
  mockups: ArtworkFile[];
  logoFiles: ArtworkFile[];
  colorSeparations: ArtworkFile[];
  digitizedLogos: ArtworkFile[];
  dtfGangSheets: ArtworkFile[];
}

interface CustomerArtworkProps {
  files: ArtworkFiles;
}

export function CustomerArtwork({ files }: CustomerArtworkProps) {
  return (
    <ScrollArea className="h-[calc(100vh-220px)] overflow-hidden">
      <div className="space-y-6 pb-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Image className="h-5 w-5 mr-2" />
              Mockups
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>File Name</TableHead>
                  <TableHead>Date Added</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {files.mockups.map((file, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium flex items-center">
                      <Image className="h-4 w-4 mr-2 text-blue-500" />
                      {file.name}
                    </TableCell>
                    <TableCell>{file.date}</TableCell>
                    <TableCell>{file.size}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                      <Button variant="ghost" size="sm">
                        Download
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <File className="h-5 w-5 mr-2" />
              Logo Files
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>File Name</TableHead>
                  <TableHead>Date Added</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {files.logoFiles.map((file, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium flex items-center">
                      <File className="h-4 w-4 mr-2 text-blue-500" />
                      {file.name}
                    </TableCell>
                    <TableCell>{file.date}</TableCell>
                    <TableCell>{file.size}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                      <Button variant="ghost" size="sm">
                        Download
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PenTool className="h-5 w-5 mr-2" />
              Colour Separations
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>File Name</TableHead>
                  <TableHead>Date Added</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {files.colorSeparations.map((file, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-blue-500" />
                      {file.name}
                    </TableCell>
                    <TableCell>{file.date}</TableCell>
                    <TableCell>{file.size}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                      <Button variant="ghost" size="sm">
                        Download
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Code className="h-5 w-5 mr-2" />
              Digitized Logos
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>File Name</TableHead>
                  <TableHead>Date Added</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {files.digitizedLogos.map((file, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium flex items-center">
                      <Code className="h-4 w-4 mr-2 text-blue-500" />
                      {file.name}
                    </TableCell>
                    <TableCell>{file.date}</TableCell>
                    <TableCell>{file.size}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                      <Button variant="ghost" size="sm">
                        Download
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Folder className="h-5 w-5 mr-2" />
              DTF Gang Sheets
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>File Name</TableHead>
                  <TableHead>Date Added</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {files.dtfGangSheets.map((file, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium flex items-center">
                      <Folder className="h-4 w-4 mr-2 text-blue-500" />
                      {file.name}
                    </TableCell>
                    <TableCell>{file.date}</TableCell>
                    <TableCell>{file.size}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                      <Button variant="ghost" size="sm">
                        Download
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
}
