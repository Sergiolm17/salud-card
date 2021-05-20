import "./App.css";
import { Box, FileInput, Form, FormField, Button } from "grommet";
import { useState } from "react";

function App() {
    const [validator, setValidator] = useState(false);
    return (
        <div className="App">
            <header className="App-header">
                <Box
                    direction="row"
                    border={{ color: "brand", size: "large" }}
                    pad="medium"
                >
                    <form
                        method="post"
                        action="/"
                        encType="multipart/form-data"
                    >
                        <FormField
                            name="fileUploaded"
                            htmlFor="file-input-id"
                            label="Subir archivo"
                        >
                            <FileInput
                                messages={{
                                    browse: "o navegue",
                                    dropPrompt: "Coloque el archivo aquí ",
                                    dropPromptMultiple: "string3",
                                    files: "string4",
                                    remove: "string5",
                                    removeAll: "string6",
                                }}
                                id="file-input-id"
                                name="fileUploaded"
                                onChange={(event) => {
                                    const fileList = event.target.files;
                                    const file = fileList[0].name;
                                    console.log(file.includes("xlsx"));
                                    setValidator(file.includes("xlsx"));
                                }}
                            />
                        </FormField>
                        <Box
                            direction="row"
                            gap="medium"
                            alignContent="center"
                            alignSelf="center"
                        >
                            <Button
                                type="submit"
                                disabled={!validator}
                                primary
                                label="Enviar"
                            />
                        </Box>
                    </form>
                </Box>
            </header>
        </div>
    );
}

export default App;
