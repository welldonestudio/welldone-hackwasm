import React, { useState, useEffect } from "react";
import axios, { AxiosResponse } from "axios";
import {
    Box,
    Container,
    Typography,
    Grid,
} from "@mui/material";
import { styled } from "@mui/system";
import VerifyIcon from "@mui/icons-material/Verified";
import JSZip from "jszip";
import { DataGrid } from '@mui/x-data-grid';
import FileViewer from '../FileViewer';
import { makeStyles } from '@mui/styles';
import CircularProgress from '@mui/material/CircularProgress';

const useStyles = makeStyles((theme) => ({
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 9999,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingMessage: {
        color: '#ffffff',
        fontSize: '2em',
        textAlign: 'center',
    },
}));


const HeaderTypography = styled(Typography)(({ theme }) => ({
    borderBottom: `4px solid`,
    display: "inline-block",
}));

function Neutron() {
    const [unzippedFiles, setUnzippedFiles] = useState<any>([]);
    const [activeTab, setActiveTab] = useState(0);

    const [data, setData] = useState([]);
    const [selectedData, setSelectedData] = useState(null);
    const [verificationResult, setVerificationResult] = useState<any>(null);

    const classes = useStyles();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const result = await axios(
                'https://prod.neutron.compiler.welldonestudio.io/neutron-deploy-histories?chainId=testnet&offset=0&fetchSize=50',
            );

            console.log(result.data)
            setData(result.data.reverse());
        };
        fetchData();
    }, []);

    const handleRowClick = async (param: any) => {
        setIsLoading(true)
        setSelectedData(param.row);

        try {
            const response = await axios.post(
                'https://prod.neutron.compiler.welldonestudio.io/verification/neutron',
                { contractAddress: param.row.contractAddress, chainId: 'testnet' }
            );
            if (response.data.isVerified) {
                let resFile = await fetch(response.data.srcUrl)
                console.log(resFile)
                if (!resFile.ok) {
                    throw new Error('Network response was not ok');
                }

                const arrayBuffer = await resFile.arrayBuffer();
                const blob = new Blob([arrayBuffer], { type: "application/zip" });

                console.log(blob);

                const zip = new JSZip();
                const unzipped = await zip.loadAsync(blob);

                const codes = await processFiles(unzipped);

                console.log(codes)
                setUnzippedFiles(codes);
            }
            setVerificationResult(response.data);
            console.log(response.data)
            setIsLoading(false)
        } catch (err) {
            console.error(err);
            setIsLoading(false)
        }
    };

    const processFiles = async (unzipped: any) => {
        const filePromises: any = [];

        unzipped.forEach((relativePath: any, file: any) => {
            if (!file.dir) {
                const filePromise = file.async("text").then((content: any) => {
                    return { name: file.name, content: content };
                });
                filePromises.push(filePromise);
            }
        });

        const codes = await Promise.all(filePromises);
        return codes;
    };

    const DataTable = ({
        data,
        setData,
        selectedData,
        setSelectedData,
        verificationResult,
        setVerificationResult,
        handleRowClick
    }: {
        data: any,
        setData: React.Dispatch<React.SetStateAction<any>>,
        selectedData: any,
        setSelectedData: React.Dispatch<React.SetStateAction<any>>,
        verificationResult: any,
        setVerificationResult: React.Dispatch<React.SetStateAction<any>>,
        handleRowClick: (param: any) => Promise<void>
    }) => {
        const columns = [
            { field: 'contractAddress', headerName: 'Contract Address', width: '450', headerAlign: 'center', align: 'center' },
            { field: 'envOsName', headerName: 'OS', width: '150', headerAlign: 'center', align: 'center' },
            { field: 'envOsVersion', headerName: 'OS Version', width: '120', headerAlign: 'center', align: 'center' },
            { field: 'envRustcVersion', headerName: 'Rust Version', width: '120', headerAlign: 'center', align: 'center' },
            { field: 'envCargoWasmVersion', headerName: 'Cargo Version', width: '120', headerAlign: 'center', align: 'center' },
            { field: 'envOsMachine', headerName: 'Machine', width: '150', headerAlign: 'center', align: 'center' },
        ];

        return (
            <div style={{ width: '100%' }}>
                <DataGrid rows={data} columns={columns as any} onRowClick={handleRowClick}
                    initialState={{
                        pagination: {
                            paginationModel: {
                                pageSize: 5,
                            },
                        },
                    }}
                    pageSizeOptions={[5]}
                />
                {verificationResult && (
                    <div>
                        {verificationResult.isVerified ? (
                            <div>
                                <h2><span style={{ color: 'green' }}>✓ </span>Verification Successful</h2>
                                <Box mb={3}>
                                    <p>isImmutable: {verificationResult.isImmutable ? 'Yes' : <>No <span style={{ color: 'red' }}>(This is upgradable)</span></>}</p>
                                </Box>
                                <Box mb={3}>
                                    <h3>Build & Optimize Script</h3>
                                    <FileViewer code={'> ' + verificationResult?.envBuildScript + '\n' + '> ' + verificationResult?.envOptimizerScript} />
                                </Box>

                                <Box mb={3}>
                                    <div>
                                        <div>
                                            {unzippedFiles.map((file: any, index: any) => (
                                                <button
                                                    type="button"
                                                    key={index}
                                                    onClick={(event) => {
                                                        event.preventDefault();
                                                        setActiveTab(index);
                                                    }}
                                                >
                                                    {file.name}
                                                </button>
                                            ))}
                                        </div>

                                        <div>
                                            <h3>{unzippedFiles[activeTab]?.name}</h3>
                                            <FileViewer code={unzippedFiles[activeTab]?.content} />
                                        </div>
                                    </div>

                                </Box>
                            </div>
                        ) : (
                            <div>
                                <h2><span style={{ color: 'red' }}>✗ </span>Verification Failed</h2>
                                <p>{verificationResult.errMsg}</p>
                                <Box mb={3}>
                                    <p>isImmutable: {verificationResult.isImmutable ? 'Yes' : <>No <span style={{ color: 'red' }}>(This is upgradable)</span></>}</p>
                                </Box>
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }

    return (
        <Container maxWidth="lg">
            <Box sx={{ my: 4 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item>
                        <VerifyIcon fontSize="large" />
                    </Grid>
                    <Grid item>
                        <Box component="h1">
                            <HeaderTypography variant="h4">Neutron Smart Contract Verification Service</HeaderTypography>
                        </Box>
                    </Grid>
                </Grid>

                <Box mb={3}>
                    <Typography variant="h6" gutterBottom>
                        About
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        Neutron Smart Contract Verification API is a platform for verifying CosmWasm smart contracts deployed on Remix IDE. <br />Our principle is simple: <strong>'Don't trust, verify'.</strong></Typography>
                </Box>
                <Box mb={3}>
                    <Typography variant="h6" gutterBottom>
                        User Manual
                    </Typography>
                    <Typography variant="body1">
                        <ul>
                            <li style={{
                                marginBottom: '10px',
                                fontSize: '16px',
                                lineHeight: '1.5'
                            }}>Refer to the <a href="https://docs.welldonestudio.io/code/deploy-and-run/neutron" target="_blank">Manual</a> to write and compile your contract, then proceed with the deployment. The process of contract creation and compilation can be complex, so handle it with care.</li>
                            <li style={{
                                marginBottom: '10px',
                                fontSize: '16px',
                                lineHeight: '1.5'
                            }}>Once the contract is compiled and deployed, it will automatically be stored in the database and will appear on this page's list.</li>
                            <li style={{
                                marginBottom: '10px',
                                fontSize: '16px',
                                lineHeight: '1.5'
                            }}>By clicking on a specific contract address in the table below, you can verify the contract by comparing the code id and checksum stored in the DB with the code id and checksum on-chain. This step is crucial for confirming the integrity of the contract.</li>
                            <li style={{
                                marginBottom: '10px',
                                fontSize: '16px',
                                lineHeight: '1.5'
                            }}>While we do provide the verification feature directly, a key point is that we offer information about the Rust build environment to allow anyone to verify contracts. Given that Rust's build results are non-deterministic when compiling into wasm, the provision of this build environment information becomes especially important. This information will allow developers to definitively ascertain if the contract is functioning as expected.</li>

                        </ul>
                    </Typography>
                </Box>
                <Box mb={3}>
                    <DataTable
                        data={data}
                        setData={setData}
                        selectedData={selectedData}
                        setSelectedData={setSelectedData}
                        verificationResult={verificationResult}
                        setVerificationResult={setVerificationResult}
                        handleRowClick={handleRowClick}
                    />
                </Box>
            </Box>
            {
                isLoading && (
                    <div className={classes.overlay}>
                        <div className={classes.loadingMessage}>
                            <CircularProgress color="inherit" />
                            <p>Verifying...</p>
                        </div>
                    </div>
                )
            }

        </Container >
    );
}


export default Neutron;

