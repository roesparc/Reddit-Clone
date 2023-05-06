import stylesOuter from "../../styles/shared/LocationMainContent.module.css";
import styles from "../../styles/createPost/CreatePost.module.css";
import stylesBtn from "../../styles/elements/buttons.module.css";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Community } from "../../ts_common/interfaces";
import { INITIAL_COMMUNITY } from "../../ts_common/initialStates";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDocs,
  limit,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../firebase/config";
import { BsFileTextFill, BsFillImageFill } from "react-icons/bs";
import CommunitySelector from "./CommunitySelector";
import { useAppSelector } from "../../redux/hooks";
import { selectUserProfile } from "../../redux/features/auth";
import { ImSpinner2 } from "react-icons/im";

const CreatePost = () => {
  const { subName } = useParams();
  const userProfile = useAppSelector(selectUserProfile);
  const navigate = useNavigate();

  const [subInfo, setSubInfo] = useState<Community>(INITIAL_COMMUNITY);
  const [selectedType, setSelectedType] = useState<"post" | "image">("post");
  const [isPostValid, setIsPostValid] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [body, setBody] = useState<string>("");
  const [img, setImg] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const createPost = async () => {
    setIsSubmitting(true);

    const postRef = await addDoc(collection(db, "posts"), {
      authorId: userProfile.uid,
      subId: subInfo.id,
      title: title,
      body: body,
      img: img,
      timestamp: serverTimestamp(),
      upvotes: 1,
      downvotes: 0,
      commentNumber: 0,
    });

    await updateDoc(doc(db, "users", userProfile.uid), {
      upvotedPosts: arrayUnion(postRef.id),
    });

    navigate(`/r/${subInfo.name}/${postRef.id}`);
  };

  useEffect(() => {
    const verifyPostValidity = () => {
      if (title.length > 0 && subInfo.id.length > 0) setIsPostValid(true);
      else setIsPostValid(false);
    };
    verifyPostValidity();
  }, [title, subInfo]);

  useEffect(() => {
    const getCommunityInfoFromUrl = async () => {
      const q = query(
        collection(db, "subre_edits"),
        where("name", "==", subName),
        limit(1)
      );
      const querySnapshot = await getDocs(q);

      setSubInfo(querySnapshot.docs[0].data() as Community);
    };

    if (subName) getCommunityInfoFromUrl();
  }, [subName]);

  return (
    <div className={stylesOuter.contentWrapper}>
      <div className={styles.root}>
        <h1>Create a post</h1>

        <CommunitySelector subInfo={subInfo} setSubInfo={setSubInfo} />

        <div className={styles.createPostContainer}>
          <div className={styles.postTypeContainer}>
            <button
              className={selectedType === "post" ? styles.activeType : ""}
              onClick={() => setSelectedType("post")}
            >
              <BsFileTextFill />
              Post
            </button>
            <button
              className={selectedType === "image" ? styles.activeType : ""}
              onClick={() => setSelectedType("image")}
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

            <textarea
              className={styles.postBody}
              rows={1}
              placeholder="Text (optional)"
              value={body}
              onChange={(e) => setBody(e.target.value)}
            ></textarea>
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
    </div>
  );
};

export default CreatePost;
