import stylesOuter from "../../styles/shared/LocationMainContent.module.css";
import styles from "../../styles/createPost/CreatePost.module.css";
import stylesBtn from "../../styles/elements/buttons.module.css";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Community } from "../../ts_common/interfaces";
import { INITIAL_COMMUNITY } from "../../ts_common/initialStates";
import {
  DocumentData,
  DocumentReference,
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDocs,
  increment,
  limit,
  query,
  serverTimestamp,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { db, storage } from "../../firebase/config";
import { BsFileTextFill, BsFillImageFill } from "react-icons/bs";
import CommunitySelector from "./CommunitySelector";
import { useAppSelector } from "../../redux/hooks";
import { selectUserProfile } from "../../redux/features/auth";
import { ImSpinner2 } from "react-icons/im";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import CreateImgPost from "./CreateImgPost";
import CommunityInfo from "../Communities/CommunityInfo";

const CreatePost = () => {
  const { subName } = useParams();
  const userProfile = useAppSelector(selectUserProfile);
  const navigate = useNavigate();

  const [selectedCommunity, setSelectedCommunity] = useState<
    string | undefined
  >(subName);
  const [subInfo, setSubInfo] = useState<Community>(INITIAL_COMMUNITY);
  const [selectedType, setSelectedType] = useState<"post" | "image">("post");
  const [isPostValid, setIsPostValid] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [body, setBody] = useState<string>("");
  const [imgFile, setImgFile] = useState<Blob | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const UploadImgAndUpdatePost = async (
    postRef: DocumentReference<DocumentData>
  ) => {
    const storageRef = ref(storage, `posts/${postRef.id}`);
    await uploadBytes(storageRef, imgFile!);
    const imgUrl = await getDownloadURL(storageRef);
    await updateDoc(postRef, { img: imgUrl });
  };

  const createPost = async () => {
    setIsSubmitting(true);

    const postRef = await addDoc(collection(db, "posts"), {
      authorId: userProfile.uid,
      subId: subInfo.id,
      title: title,
      body: body,
      img: "",
      timestamp: serverTimestamp(),
      upvotes: 1,
      downvotes: 0,
      commentNumber: 0,
    });

    if (imgFile) await UploadImgAndUpdatePost(postRef);

    const batch = writeBatch(db);

    batch.update(doc(db, "users", userProfile.uid), {
      upvotedPosts: arrayUnion(postRef.id),
    });

    batch.update(doc(db, "subre_edits", subInfo.id), {
      postNumber: increment(1),
    });

    await batch.commit();

    navigate(`/r/${subInfo.name}/${postRef.id}`);
  };

  useEffect(() => {
    const verifyPostValidity = () => {
      let isValid = false;

      if (selectedType === "image") {
        isValid = !!imgFile && title.length > 0 && subInfo.id.length > 0;
      } else {
        isValid = title.length > 0 && subInfo.id.length > 0;
      }

      setIsPostValid(isValid);
    };

    verifyPostValidity();
  }, [title, subInfo, selectedType, imgFile]);

  useEffect(() => {
    const getCommunityInfo = async () => {
      const q = query(
        collection(db, "subre_edits"),
        where("name", "==", selectedCommunity),
        limit(1)
      );
      const querySnapshot = await getDocs(q);

      setSubInfo(querySnapshot.docs[0].data() as Community);
    };

    if (selectedCommunity) {
      setSubInfo(INITIAL_COMMUNITY);
      getCommunityInfo();
    }
  }, [selectedCommunity]);

  return (
    <div className={stylesOuter.contentWrapper}>
      <div className={styles.root}>
        <h1>Create a post</h1>

        <CommunitySelector
          subInfo={subInfo}
          setSelectedCommunity={setSelectedCommunity}
        />

        <div className={styles.createPostContainer}>
          <div className={styles.postTypeContainer}>
            <button
              className={selectedType === "post" ? styles.activeType : ""}
              onClick={() => {
                setImgFile(null);
                setSelectedType("post");
              }}
            >
              <BsFileTextFill />
              Post
            </button>
            <button
              className={selectedType === "image" ? styles.activeType : ""}
              onClick={() => {
                setBody("");
                setSelectedType("image");
              }}
            >
              <BsFillImageFill />
              Image
            </button>
          </div>

          <div className={styles.postContentWrapper}>
            <div className={styles.titleContainer}>
              <input
                type="text"
                placeholder="Title"
                maxLength={300}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <p>{title.length}/300</p>
            </div>

            {selectedType === "post" ? (
              <textarea
                className={styles.postBody}
                rows={1}
                placeholder="Text (optional)"
                value={body}
                onChange={(e) => setBody(e.target.value)}
              ></textarea>
            ) : (
              <CreateImgPost setImgFile={setImgFile} />
            )}
          </div>

          <div className={styles.submitBtnContainer}>
            <hr />

            <div>
              {isSubmitting ? (
                <ImSpinner2 className={styles.submitSpinner} />
              ) : (
                <button
                  className={stylesBtn.btnVariantOne}
                  disabled={!isPostValid && true}
                  onClick={() => createPost()}
                >
                  Post
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {selectedCommunity && <CommunityInfo subId={subInfo.id} />}
    </div>
  );
};

export default CreatePost;
