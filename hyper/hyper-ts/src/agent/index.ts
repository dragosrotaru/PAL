import {
  encryptAES,
  decryptAES,
  decryptRSA,
  encryptRSA,
  generateAESKey,
} from "../encryption";
import {
  IAgent,
  Name,
  AgentPreferences,
  IDevice,
  IPeer,
  EncryptedAgent,
  SymmetricKey,
  PublicKey,
  PrivateKey,
  EncryptedSymmetricKey,
} from "../interfaces";

interface CreationProps {
  type: "creation";
  name: Name;
  publicKey: PublicKey;
  preferences?: AgentPreferences;
}
interface DecryptionProps {
  type: "decryption";
  encryptedAgent: EncryptedAgent;
  encryptedSymmetricKey: EncryptedSymmetricKey;
  privateKey: PrivateKey;
  publicKey: PrivateKey;
}
type Props = DecryptionProps | CreationProps;

export class Agent implements IAgent {
  public name: Name;
  public devices: IDevice[] = [];
  public peers: IPeer[] = [];
  public preferences: AgentPreferences = {};
  public symmetricKey: SymmetricKey;
  public publicKey: PublicKey;
  constructor(props: Props) {
    if (props.type === "creation") {
      this.name = props.name;
      this.symmetricKey = generateAESKey();
      this.publicKey = props.publicKey;
      if (props.preferences) this.preferences = props.preferences;
    } else {
      const symmetricKey = decryptRSA(
        props.privateKey,
        props.encryptedSymmetricKey
      );
      const agent = JSON.parse(
        decryptAES(symmetricKey, props.encryptedAgent).toString()
      );
      console.log(agent);
      this.name = agent.name;
      this.symmetricKey = symmetricKey;
      this.publicKey = props.publicKey;
      if (agent.preferences) this.preferences = agent.preferences;
    }
  }
  addDevices(...devices: IDevice[]) {
    this.devices.push(...devices);
  }
  addPeers(...peers: IPeer[]) {
    this.peers.push(...peers);
  }
  get encrypted(): EncryptedAgent {
    return Buffer.from(
      encryptAES(
        this.symmetricKey,
        Buffer.from(
          JSON.stringify({
            name: this.name,
            devices: this.devices,
            peers: this.peers,
            preferences: this.preferences,
          })
        )
      )
    );
  }
  get encryptedSymmetricKey() {
    return encryptRSA(this.publicKey, this.symmetricKey);
  }
}
