import { useState } from "react";
import { Buffer } from "buffer";
import {
  Form,
  Stack,
  Button,
  Container,
  Row,
  Col,
  Card,
} from "react-bootstrap";
import QRCode from "qrcode";
import utf8 from "utf8";
import FormInput from "../form-input/FormInput";

import "./CustomForm.css";

const CustomForm = () => {
  const [errors, setErrors] = useState({});
  const [name, setName] = useState();
  const [regNum, setRegNum] = useState();
  const [timeStamp, setTimeStamp] = useState();
  const [invoiceTotal, setInvoiceTotal] = useState();
  const [vatTotal, setVatTotal] = useState();
  const [qrCodeSrc, setQrCodeSrc] = useState();
  const [qrCodeB64String, setQrCodeB64String] = useState();

  const handleGenerate = (event) => {
    event.preventDefault();
    const newErrors = findErrors();
    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
    } else {
      const sellerNameBuf = getTLV("1", utf8.encode(name.trim()));
      const vatRegistrationNumberBuf = getTLV(
        "2",
        utf8.encode(regNum.toString())
      );
      const timeStampBuf = getTLV("3", utf8.encode(timeStamp.toString()));
      const invoiceTotalBuf = getTLV("4", utf8.encode(invoiceTotal.toString()));
      const vatTotalBuf = getTLV("5", utf8.encode(vatTotal.toString()));
      const qrCodeBuf = Buffer.from(
        "".concat(
          sellerNameBuf,
          vatRegistrationNumberBuf,
          timeStampBuf,
          invoiceTotalBuf,
          vatTotalBuf
        ),
        "hex"
      );
      const qrCodeB64 = qrCodeBuf.toString("base64");
      setQrCodeB64String(qrCodeB64);
      QRCode.toDataURL(qrCodeB64).then((data) => {
        setQrCodeSrc(data);
      });
    }
  };

  const getTLV = (tagNum, tagValue) =>
    `${toHexPad(tagNum)}${toHexPad(tagValue.length)}${utf8ToHex(
      utf8.decode(tagValue)
    )}`;

  const toHexPad = (value) => {
    let hex = value.toString(16);
    if (hex.length % 2 > 0) {
      hex = "0" + hex;
    }
    return hex;
  };

  const utf8ToHex = (s) => {
    const utf8encoder = new TextEncoder();
    const rb = utf8encoder.encode(s);
    let r = "";
    for (const b of rb) {
      r += ("0" + b.toString(16)).slice(-2);
    }
    return r;
  };

  const findErrors = () => {
    const newErrors = {};
    if (!name || name === "") newErrors.name = "Cannot be empty!";
    else if (name.length > 255)
      newErrors.name = "Cannot be more than 255 characters!";
    if (!regNum) newErrors.regNum = "Cannot be empty!";
    else if (regNum.toString().length != 15)
      newErrors.regNum = "TRN must be 15 characters";
    if (!timeStamp) newErrors.timeStamp = "Cannot be empty!";
    if (!invoiceTotal) newErrors.invoiceTotal = "Cannot be empty!";
    if (!vatTotal) newErrors.vatTotal = "Cannot be empty!";
    return newErrors;
  };

  const resetSingleError = (field) => {
    errors[field] = undefined;
  };

  return (
    <div className="my-5">
      <Container>
        <Row>
          <Col lg={6} className="mb-4">
            <Stack className="border border-secondary rounded card-size">
              <Form noValidate onSubmit={handleGenerate} className="my-2">
                <FormInput
                  id="name"
                  label="Seller's Name"
                  placeholder="Eg: Abdussamad Syed"
                  type="text"
                  setValue={setName}
                  error={errors.name}
                  resetSingleError={resetSingleError}
                />
                <FormInput
                  id="regNum"
                  label="VAT registration number of the seller"
                  placeholder="Eg: 310122393500003"
                  type="number"
                  setValue={setRegNum}
                  error={errors.regNum}
                  resetSingleError={resetSingleError}
                />
                <FormInput
                  id="timeStamp"
                  label="Time stamp of the invoice (date and time)"
                  type="datetime-local"
                  setValue={setTimeStamp}
                  error={errors.timeStamp}
                  resetSingleError={resetSingleError}
                />
                <FormInput
                  id="invoiceTotal"
                  label="Invoice total (with VAT)"
                  placeholder="Eg: 7400.02"
                  type="number"
                  setValue={setInvoiceTotal}
                  error={errors.invoiceTotal}
                  resetSingleError={resetSingleError}
                />
                <FormInput
                  id="vatTotal"
                  label="VAT total"
                  placeholder="Eg: 965.22"
                  type="number"
                  setValue={setVatTotal}
                  error={errors.vatTotal}
                  resetSingleError={resetSingleError}
                />
                <Button type="submit" className="btn-style">
                  Generate QR
                </Button>
              </Form>
            </Stack>
          </Col>
          <Col lg={6}>
            <Card className="border border-secondary card-size">
              <Card.Img className="mx-auto w-75" src={qrCodeSrc}></Card.Img>
              <Card.Body className="mx-auto w-75">
                <Card.Title></Card.Title>
                <Card.Text>
                  <p>{qrCodeB64String}</p>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default CustomForm;
