import axios from "axios";

const PINATA_JWT = process.env.NEXT_PUBLIC_PINATA_JWT || "";

interface PinataResponse {
  IpfsHash: string;
  PinSize: number;
  Timestamp: string;
}

export async function uploadImage(imageFile: File): Promise<string> {
  if (!PINATA_JWT) {
    throw new Error("Pinata JWT không được cấu hình");
  }

  const formData = new FormData();
  formData.append("file", imageFile);

  const response = await axios.post<PinataResponse>(
    "https://api.pinata.cloud/pinning/pinFileToIPFS",
    formData,
    {
      headers: {
        Authorization: `Bearer ${PINATA_JWT}`,
      },
    }
  );

  return `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
}

export async function uploadTokenMetadata(data: {
  name: string;
  symbol: string;
  description: string;
  website: string;
  twitter: string;
  telegram: string;
  image: File | null;
}): Promise<string> {
  if (!PINATA_JWT) {
    throw new Error("Pinata JWT không được cấu hình");
  }

  let imageUrl = "";
  if (data.image) {
    imageUrl = await uploadImage(data.image);
  }

  const metadata = {
    name: data.name,
    symbol: data.symbol,
    description: data.description,
    image: imageUrl,
    website: data.website,
    twitter: data.twitter,
    telegram: data.telegram,
  };

  const response = await axios.post<PinataResponse>(
    "https://api.pinata.cloud/pinning/pinJSONToIPFS",
    metadata,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${PINATA_JWT}`,
      },
    }
  );

  return `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
}
